import { basename, resolve, normalize, extname, join, dirname } from 'pathe';
import fsp from 'node:fs/promises';
import defu from 'defu';
import { pipeline } from 'node:stream';
import { createReadStream, createWriteStream, statSync } from 'node:fs';
import { transform } from 'esbuild';
import jiti from 'jiti';
import { pathToFileURL } from 'node:url';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import postcssNested from 'postcss-nested';
import { findStaticImports, findExports, findTypeExports } from 'mlly';
import { createRequire } from 'node:module';
import { readPackageJSON } from 'pkg-types';
import { satisfies } from 'semver';
import { glob } from 'tinyglobby';

function copyFileWithStream(sourcePath, outPath) {
  const sourceStream = createReadStream(sourcePath);
  const outStream = createWriteStream(outPath);
  return new Promise((resolve, reject) => {
    pipeline(sourceStream, outStream, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

const DECLARATION_RE = /\.d\.[cm]?ts$/;
const CM_LETTER_RE = /(?<=\.)(c|m)(?=[jt]s$)/;
const KNOWN_EXT_RE = /\.(c|m)?[jt]sx?$/;
const TS_EXTS = /* @__PURE__ */ new Set([".ts", ".mts", ".cts"]);
const jsLoader = async (input, { options }) => {
  if (!KNOWN_EXT_RE.test(input.path) || DECLARATION_RE.test(input.path)) {
    return;
  }
  const output = [];
  let contents = await input.getContents();
  if (options.declaration && !input.srcPath?.match(DECLARATION_RE)) {
    const cm = input.srcPath?.match(CM_LETTER_RE)?.[0] || "";
    const extension2 = `.d.${cm}ts`;
    output.push({
      contents,
      srcPath: input.srcPath,
      path: input.path,
      extension: extension2,
      declaration: true
    });
  }
  if (TS_EXTS.has(input.extension)) {
    contents = await transform(contents, {
      ...options.esbuild,
      loader: "ts"
    }).then((r) => r.code);
  } else if ([".tsx", ".jsx"].includes(input.extension)) {
    contents = await transform(contents, {
      loader: input.extension === ".tsx" ? "tsx" : "jsx",
      ...options.esbuild
    }).then((r) => r.code);
  }
  const isCjs = options.format === "cjs";
  if (isCjs) {
    contents = jiti("").transform({ source: contents, retainLines: false }).replace(/^exports.default = /gm, "module.exports = ").replace(/^var _default = exports.default = /gm, "module.exports = ").replace("module.exports = void 0;", "");
  }
  let extension = isCjs ? ".js" : ".mjs";
  if (options.ext) {
    extension = options.ext.startsWith(".") ? options.ext : `.${options.ext}`;
  }
  output.push({
    contents,
    path: input.path,
    extension
  });
  return output;
};

const vueLoader = async (input, context) => {
  if (input.extension !== ".vue") {
    return;
  }
  const output = [
    {
      path: input.path,
      contents: await input.getContents()
    }
  ];
  let earlyReturn = true;
  for (const blockLoader of [styleLoader, scriptLoader]) {
    const result = await blockLoader(
      { ...input, getContents: () => output[0].contents },
      context
    );
    if (!result) {
      continue;
    }
    earlyReturn = false;
    const [vueFile, ...files] = result;
    output[0] = vueFile;
    output.push(...files);
  }
  if (earlyReturn) {
    return;
  }
  return output;
};
const vueBlockLoader = (options) => async (input, { loadFile }) => {
  const contents = await input.getContents();
  const BLOCK_RE = new RegExp(
    `<${options.type}((\\s[^>\\s]*)*)>([\\S\\s.]*?)<\\/${options.type}>`,
    "g"
  );
  const matches = [...contents.matchAll(BLOCK_RE)];
  if (matches.length === 0) {
    return;
  }
  if (options.type === "script" && matches.length > 1) {
    return;
  }
  const [block, attributes = "", _, blockContents] = matches[0];
  if (!block || !blockContents) {
    return;
  }
  if (options.exclude?.some((re) => re.test(attributes))) {
    return;
  }
  const [, lang = options.outputLang] = attributes.match(/lang="([a-z]*)"/) || [];
  const extension = "." + lang;
  const files = await loadFile({
    getContents: () => blockContents,
    path: `${input.path}${extension}`,
    srcPath: `${input.srcPath}${extension}`,
    extension
  }) || [];
  const blockOutputFile = files.find(
    (f) => f.extension === `.${options.outputLang}` || options.validExtensions?.includes(f.extension)
  );
  if (!blockOutputFile) {
    return;
  }
  const newAttributes = attributes.replace(
    new RegExp(`\\s?lang="${lang}"`),
    ""
  );
  return [
    {
      path: input.path,
      contents: contents.replace(
        block,
        `<${options.type}${newAttributes}>
${blockOutputFile.contents?.trim()}
</${options.type}>`
      )
    },
    ...files.filter((f) => f !== blockOutputFile)
  ];
};
const styleLoader = vueBlockLoader({
  outputLang: "css",
  type: "style"
});
const scriptLoader = vueBlockLoader({
  outputLang: "js",
  type: "script",
  exclude: [/\bsetup\b/],
  validExtensions: [".js", ".mjs"]
});

const sassLoader = async (input) => {
  if (![".sass", ".scss"].includes(input.extension)) {
    return;
  }
  if (basename(input.srcPath).startsWith("_")) {
    return [
      {
        contents: "",
        path: input.path,
        skip: true
      }
    ];
  }
  const compileString = await import('sass').then(
    (r) => r.compileString || r.default.compileString
  );
  const output = [];
  const contents = await input.getContents();
  output.push({
    contents: compileString(contents, {
      loadPaths: ["node_modules"],
      url: pathToFileURL(input.srcPath)
    }).css,
    path: input.path,
    extension: ".css"
  });
  return output;
};

const postcssLoader = async (input, ctx) => {
  if (ctx.options.postcss === false || ![".css"].includes(input.extension)) {
    return;
  }
  const output = [];
  const contents = await input.getContents();
  const transformed = await postcss(
    [
      ctx.options.postcss?.nested !== false && postcssNested(ctx.options.postcss?.nested),
      ctx.options.postcss?.autoprefixer !== false && autoprefixer(ctx.options.postcss?.autoprefixer),
      ctx.options.postcss?.cssnano !== false && cssnano(ctx.options.postcss?.cssnano),
      ...ctx.options.postcss?.plugins || []
    ].filter(Boolean)
  ).process(contents, {
    ...ctx.options.postcss?.processOptions,
    from: input.srcPath
  });
  output.push({
    contents: transformed.content,
    path: input.path,
    extension: ".css"
  });
  return output;
};

const loaders = {
  js: jsLoader,
  vue: vueLoader,
  sass: sassLoader,
  postcss: postcssLoader
};
const defaultLoaders = ["js", "vue", "sass", "postcss"];
function resolveLoader(loader) {
  if (typeof loader === "string") {
    return loaders[loader];
  }
  return loader;
}
function resolveLoaders(loaders2 = defaultLoaders) {
  return loaders2.map((loaderName) => {
    const _loader = resolveLoader(loaderName);
    if (!_loader) {
      console.warn("Unknown loader:", loaderName);
    }
    return _loader;
  }).filter(Boolean);
}

function createLoader(loaderOptions = {}) {
  const loaders = resolveLoaders(loaderOptions.loaders);
  const loadFile = async function(input) {
    const context = {
      loadFile,
      options: loaderOptions
    };
    for (const loader of loaders) {
      const outputs = await loader(input, context);
      if (outputs?.length) {
        return outputs;
      }
    }
    return [
      {
        path: input.path,
        srcPath: input.srcPath,
        raw: true
      }
    ];
  };
  return {
    loadFile
  };
}

async function normalizeCompilerOptions(_options) {
  const ts = await import('typescript').then((r) => r.default || r);
  return ts.convertCompilerOptionsFromJson(_options, process.cwd()).options;
}
async function getDeclarations(vfs, opts) {
  const ts = await import('typescript').then((r) => r.default || r);
  const inputFiles = [...vfs.keys()];
  const tsHost = ts.createCompilerHost(opts.typescript.compilerOptions);
  tsHost.writeFile = (fileName, declaration) => {
    vfs.set(fileName, declaration);
  };
  const _readFile = tsHost.readFile;
  tsHost.readFile = (filename) => {
    if (vfs.has(filename)) {
      return vfs.get(filename);
    }
    return _readFile(filename);
  };
  const program = ts.createProgram(
    inputFiles,
    opts.typescript.compilerOptions,
    tsHost
  );
  const result = program.emit();
  if (result.diagnostics?.length) {
    console.error(ts.formatDiagnostics(result.diagnostics, tsHost));
  }
  return extractDeclarations(vfs, inputFiles, opts);
}
const JS_EXT_RE = /\.(m|c)?(ts|js)$/;
const JSX_EXT_RE = /\.(m|c)?(ts|js)x?$/;
const RELATIVE_RE = /^\.{1,2}[/\\]/;
function extractDeclarations(vfs, inputFiles, opts) {
  const output = {};
  for (const filename of inputFiles) {
    const dtsFilename = filename.replace(JSX_EXT_RE, ".d.$1ts");
    let contents = vfs.get(dtsFilename) || "";
    if (opts?.addRelativeDeclarationExtensions) {
      const ext = filename.match(JS_EXT_RE)?.[0].replace(/ts$/, "js") || ".js";
      const imports = findStaticImports(contents);
      const exports = findExports(contents);
      const typeExports = findTypeExports(contents);
      for (const spec of [...exports, ...typeExports, ...imports]) {
        if (!spec.specifier || !RELATIVE_RE.test(spec.specifier)) {
          continue;
        }
        const srcPath = resolve(filename, "..", spec.specifier);
        const srcDtsPath = srcPath + ext.replace(JS_EXT_RE, ".d.$1ts");
        let specifier = spec.specifier;
        try {
          if (!vfs.get(srcDtsPath)) {
            const stat = statSync(srcPath);
            if (stat.isDirectory()) {
              specifier += "/index";
            }
          }
        } catch {
        }
        contents = contents.replace(
          spec.code,
          spec.code.replace(spec.specifier, specifier + ext)
        );
      }
    }
    output[filename] = contents;
    vfs.delete(filename);
  }
  return output;
}

const require = createRequire(import.meta.url);
async function getVueDeclarations(vfs, opts) {
  const fileMapping = getFileMapping(vfs);
  const srcFiles = Object.keys(fileMapping);
  const originFiles = Object.values(fileMapping);
  if (originFiles.length === 0) {
    return;
  }
  const pkgInfo = await readPackageJSON("vue-tsc").catch(() => {
  });
  if (!pkgInfo) {
    console.warn(
      "[mkdist] Please install `vue-tsc` to generate Vue SFC declarations."
    );
    return;
  }
  const { version } = pkgInfo;
  switch (true) {
    case satisfies(version, "^1.8.27"): {
      await emitVueTscV1(vfs, opts.typescript.compilerOptions, srcFiles);
      break;
    }
    case satisfies(version, "~v2.0.0"): {
      await emitVueTscV2(vfs, opts.typescript.compilerOptions, srcFiles);
      break;
    }
    default: {
      await emitVueTscLatest(vfs, opts.typescript.compilerOptions, srcFiles);
    }
  }
  return extractDeclarations(vfs, originFiles, opts);
}
const SFC_EXT_RE = /\.vue\.[cm]?[jt]s$/;
function getFileMapping(vfs) {
  const files = /* @__PURE__ */ Object.create(null);
  for (const [srcPath] of vfs) {
    if (SFC_EXT_RE.test(srcPath)) {
      files[srcPath.replace(SFC_EXT_RE, ".vue")] = srcPath;
    }
  }
  return files;
}
async function emitVueTscV1(vfs, compilerOptions, srcFiles) {
  const vueTsc = await import('vue-tsc').then((r) => r.default || r).catch(() => void 0);
  const ts = require("typescript");
  const tsHost = ts.createCompilerHost(compilerOptions);
  const _tsSysWriteFile = ts.sys.writeFile;
  ts.sys.writeFile = (filename, content) => {
    vfs.set(filename, content);
  };
  const _tsSysReadFile = ts.sys.readFile;
  ts.sys.readFile = (filename, encoding) => {
    if (vfs.has(filename)) {
      return vfs.get(filename);
    }
    return _tsSysReadFile(filename, encoding);
  };
  try {
    const program = vueTsc.createProgram({
      rootNames: srcFiles,
      options: compilerOptions,
      host: tsHost
    });
    const result = program.emit();
    if (result.diagnostics?.length) {
      console.error(ts.formatDiagnostics(result.diagnostics, tsHost));
    }
  } finally {
    ts.sys.writeFile = _tsSysWriteFile;
    ts.sys.readFile = _tsSysReadFile;
  }
}
async function emitVueTscV2(vfs, compilerOptions, srcFiles) {
  const { resolve: resolveModule } = await import('mlly');
  const ts = await import('typescript').then(
    (r) => r.default || r
  );
  const vueTsc = await import('vue-tsc');
  const requireFromVueTsc = createRequire(await resolveModule("vue-tsc"));
  const vueLanguageCore = requireFromVueTsc("@vue/language-core");
  const volarTs = requireFromVueTsc("@volar/typescript");
  const tsHost = ts.createCompilerHost(compilerOptions);
  tsHost.writeFile = (filename, content) => {
    vfs.set(filename, vueTsc.removeEmitGlobalTypes(content));
  };
  const _tsReadFile = tsHost.readFile.bind(tsHost);
  tsHost.readFile = (filename) => {
    if (vfs.has(filename)) {
      return vfs.get(filename);
    }
    return _tsReadFile(filename);
  };
  const _tsFileExist = tsHost.fileExists.bind(tsHost);
  tsHost.fileExists = (filename) => {
    return vfs.has(filename) || _tsFileExist(filename);
  };
  const programOptions = {
    rootNames: srcFiles,
    options: compilerOptions,
    host: tsHost
  };
  const createProgram = volarTs.proxyCreateProgram(
    ts,
    ts.createProgram,
    (ts2, options) => {
      const vueLanguagePlugin = vueLanguageCore.createVueLanguagePlugin(
        ts2,
        (id) => id,
        () => "",
        (fileName) => {
          const fileMap = /* @__PURE__ */ new Set();
          for (const vueFileName of options.rootNames.map(
            (rootName) => normalize(rootName)
          )) {
            fileMap.add(vueFileName);
          }
          return fileMap.has(fileName);
        },
        options.options,
        vueLanguageCore.resolveVueCompilerOptions({})
      );
      return [vueLanguagePlugin];
    }
  );
  const program = createProgram(programOptions);
  const result = program.emit();
  if (result.diagnostics?.length) {
    console.error(ts.formatDiagnostics(result.diagnostics, tsHost));
  }
}
async function emitVueTscLatest(vfs, compilerOptions, srcFiles) {
  const { resolve: resolveModule } = await import('mlly');
  const ts = await import('typescript').then(
    (r) => r.default || r
  );
  const requireFromVueTsc = createRequire(await resolveModule("vue-tsc"));
  const vueLanguageCore = requireFromVueTsc("@vue/language-core");
  const volarTs = requireFromVueTsc("@volar/typescript");
  const tsHost = ts.createCompilerHost(compilerOptions);
  tsHost.writeFile = (filename, content) => {
    vfs.set(filename, content);
  };
  const _tsReadFile = tsHost.readFile.bind(tsHost);
  tsHost.readFile = (filename) => {
    if (vfs.has(filename)) {
      return vfs.get(filename);
    }
    return _tsReadFile(filename);
  };
  const _tsFileExist = tsHost.fileExists.bind(tsHost);
  tsHost.fileExists = (filename) => {
    return vfs.has(filename) || _tsFileExist(filename);
  };
  const programOptions = {
    rootNames: srcFiles,
    options: compilerOptions,
    host: tsHost
  };
  const createProgram = volarTs.proxyCreateProgram(
    ts,
    ts.createProgram,
    (ts2, options) => {
      const vueLanguagePlugin = vueLanguageCore.createVueLanguagePlugin(
        ts2,
        options.options,
        vueLanguageCore.resolveVueCompilerOptions({}),
        (id) => id
      );
      return [vueLanguagePlugin];
    }
  );
  const program = createProgram(programOptions);
  const result = program.emit();
  if (result.diagnostics?.length) {
    console.error(ts.formatDiagnostics(result.diagnostics, tsHost));
  }
}

async function mkdist(options = {}) {
  options.rootDir = resolve(process.cwd(), options.rootDir || ".");
  options.srcDir = resolve(options.rootDir, options.srcDir || "src");
  options.distDir = resolve(options.rootDir, options.distDir || "dist");
  if (options.cleanDist !== false) {
    await fsp.unlink(options.distDir).catch(() => {
    });
    await fsp.rm(options.distDir, { recursive: true, force: true });
    await fsp.mkdir(options.distDir, { recursive: true });
  }
  const filePaths = await glob(options.pattern || "**", {
    absolute: false,
    cwd: options.srcDir
  });
  const files = filePaths.map((path) => {
    const sourcePath = resolve(options.srcDir, path);
    return {
      path,
      srcPath: sourcePath,
      extension: extname(path),
      getContents: () => fsp.readFile(sourcePath, { encoding: "utf8" })
    };
  });
  options.typescript || (options.typescript = {});
  if (options.typescript.compilerOptions) {
    options.typescript.compilerOptions = await normalizeCompilerOptions(
      options.typescript.compilerOptions
    );
  }
  options.typescript.compilerOptions = defu(
    { noEmit: false },
    options.typescript.compilerOptions,
    {
      allowJs: true,
      declaration: true,
      incremental: true,
      skipLibCheck: true,
      strictNullChecks: true,
      emitDeclarationOnly: true,
      allowNonTsExtensions: true
    }
  );
  const { loadFile } = createLoader(options);
  const outputs = [];
  for (const file of files) {
    outputs.push(...await loadFile(file) || []);
  }
  for (const output of outputs.filter((o) => o.extension)) {
    const renamed = basename(output.path, extname(output.path)) + output.extension;
    output.path = join(dirname(output.path), renamed);
    if (outputs.some((o) => o !== output && o.path === output.path)) {
      output.skip = true;
    }
  }
  const dtsOutputs = outputs.filter((o) => o.declaration && !o.skip);
  if (dtsOutputs.length > 0) {
    const vfs = new Map(dtsOutputs.map((o) => [o.srcPath, o.contents || ""]));
    const declarations = /* @__PURE__ */ Object.create(null);
    for (const loader of [getVueDeclarations, getDeclarations]) {
      Object.assign(declarations, await loader(vfs, options));
    }
    for (const output of dtsOutputs) {
      output.contents = declarations[output.srcPath] || "";
    }
  }
  const outPaths = new Set(outputs.map((o) => o.path));
  const resolveId = (from, id = "", resolveExtensions) => {
    if (!id.startsWith(".")) {
      return id;
    }
    for (const extension of resolveExtensions) {
      if (outPaths.has(join(dirname(from), id + extension))) {
        return id + extension;
      }
    }
    return id;
  };
  const esmResolveExtensions = [
    "",
    "/index.mjs",
    "/index.js",
    ".mjs",
    ".ts",
    ".js"
  ];
  for (const output of outputs.filter(
    (o) => o.extension === ".mjs" || o.extension === ".js"
  )) {
    output.contents = output.contents.replace(
      /(import|export)(\s+(?:.+|{[\s\w,]+})\s+from\s+["'])(.*)(["'])/g,
      (_, type, head, id, tail) => type + head + resolveId(output.path, id, esmResolveExtensions) + tail
    ).replace(
      /import\((["'])(.*)(["'])\)/g,
      (_, head, id, tail) => "import(" + head + resolveId(output.path, id, esmResolveExtensions) + tail + ")"
    );
  }
  const cjsResolveExtensions = ["", "/index.cjs", ".cjs"];
  for (const output of outputs.filter((o) => o.extension === ".cjs")) {
    output.contents = output.contents.replace(
      /require\((["'])(.*)(["'])\)/g,
      (_, head, id, tail) => "require(" + head + resolveId(output.path, id, cjsResolveExtensions) + tail + ")"
    );
  }
  const writtenFiles = [];
  await Promise.all(
    outputs.filter((o) => !o.skip).map(async (output) => {
      const outFile = join(options.distDir, output.path);
      await fsp.mkdir(dirname(outFile), { recursive: true });
      await (output.raw ? copyFileWithStream(output.srcPath, outFile) : fsp.writeFile(outFile, output.contents, "utf8"));
      writtenFiles.push(outFile);
    })
  );
  return {
    writtenFiles
  };
}

export { mkdist };
