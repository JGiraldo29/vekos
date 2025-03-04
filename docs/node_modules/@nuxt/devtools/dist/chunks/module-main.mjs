import fs$1, { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import os, { homedir } from 'node:os';
import { logger, useNuxt, addPlugin, addTemplate, addVitePlugin } from '@nuxt/kit';
import { colors } from 'consola/utils';
import { join, dirname as dirname$1, resolve } from 'pathe';
import sirv from 'sirv';
import { searchForWorkspaceRoot } from 'vite';
import { d as defaultAllowedExtensions, a as defaultTabOptions, W as WS_EVENT_NAME } from '../shared/devtools.5ac54dae.mjs';
import { dirname, join as join$1, relative, parse } from 'node:path';
import { randomStr } from '@antfu/utils';
import { hash } from 'ohash';
import { runtimeDir, clientDir, packageDir, isGlobalInstall } from '../dirs.mjs';
import { createBirpcGroup } from 'birpc';
import { stringify, parse as parse$1 } from 'flatted';
import { startSubprocess } from '@nuxt/devtools-kit';
import Git from 'simple-git';
import { glob } from 'tinyglobby';
import { imageMeta } from 'image-meta';
import { debounce } from 'perfect-debounce';
import destr from 'destr';
import { snakeCase } from 'scule';
import { resolveBuiltinPresets } from 'unimport';
import { setupHooksDebug } from '../../dist/runtime/shared/hooks.js';
import isInstalledGlobally from 'is-installed-globally';
import { parseModule } from 'magicast';
import { addNuxtModule, getDefaultExportOptions } from 'magicast/helpers';
import { detectPackageManager } from 'nypm';
import { createRequire } from 'node:module';
import { getPackageInfo } from 'local-pkg';
import 'pkg-types';
import semver from 'semver';

const version = "1.7.0";

function getHomeDir() {
  return process.env.XDG_CONFIG_HOME || homedir();
}
async function readLocalOptions(defaults, options) {
  const { filePath } = getOptionsFilepath(options);
  if (existsSync(filePath)) {
    try {
      const options2 = {
        ...defaults,
        ...JSON.parse(await fs.readFile(filePath, "utf-8")).settings || {}
      };
      return options2;
    } catch (e) {
      console.error(`[DevTools] failed to parse local options file: ${filePath}, fallback to defaults`);
      console.error(e);
      return { ...defaults };
    }
  } else {
    return { ...defaults };
  }
}
function getOptionsFilepath(options) {
  let hashedKey;
  if (options.key)
    hashedKey = hash(`${options.root}:${options.key}`);
  else
    hashedKey = hash(options.root);
  const home = getHomeDir();
  const filePath = join(home, ".nuxt/devtools", `${hashedKey}.json`);
  return {
    filePath,
    hashedKey
  };
}
async function clearLocalOptions(options) {
  const { filePath } = getOptionsFilepath(options);
  if (existsSync(filePath))
    await fs.unlink(filePath);
}
async function writeLocalOptions(settings, options) {
  const { filePath, hashedKey } = getOptionsFilepath(options);
  await fs.mkdir(dirname(filePath), { recursive: true });
  await fs.writeFile(
    filePath,
    JSON.stringify(
      {
        root: options.root,
        hash: hashedKey,
        settings
      },
      null,
      2
    ),
    "utf-8"
  );
}

let token;
async function getDevAuthToken() {
  if (token)
    return token;
  const home = getHomeDir();
  const dir = join$1(home, ".nuxt/devtools");
  const filepath = join$1(dir, "dev-auth-token.txt");
  if (existsSync(filepath))
    token = (await fs.readFile(filepath, "utf-8")).trim();
  if (!token)
    token = randomStr(16);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filepath, token, "utf-8");
  return token;
}

function setupAnalyzeBuildRPC({ nuxt, refresh, ensureDevAuthToken }) {
  let builds = [];
  let promise;
  let initalized;
  const processId = "devtools:analyze-build";
  const analyzeDir = join(nuxt.options.rootDir, ".nuxt/analyze");
  async function startAnalyzeBuild(name) {
    if (promise)
      throw new Error("Already building");
    const result = startSubprocess({
      command: "npx",
      args: ["nuxi", "analyze", "--no-serve", "--name", name],
      cwd: nuxt.options.rootDir
    }, {
      id: processId,
      name: "Analyze Build",
      icon: "logos-nuxt-icon"
    }, nuxt);
    refresh("getAnalyzeBuildInfo");
    promise = result.getProcess().then(() => {
      refresh("getAnalyzeBuildInfo");
      return readBuildInfo();
    }).finally(() => {
      promise = void 0;
      initalized = void 0;
      refresh("getAnalyzeBuildInfo");
    });
    return processId;
  }
  async function readBuildInfo() {
    const files = await glob(["*/meta.json"], { cwd: analyzeDir, onlyFiles: true, absolute: true });
    builds = await Promise.all(files.map(async (file) => {
      const dir = dirname$1(file);
      const json = JSON.parse(await fs.readFile(file, "utf-8"));
      return {
        ...json,
        features: {
          bundleClient: fs$1.existsSync(join(dir, "client.html")),
          bundleNitro: fs$1.existsSync(join(dir, "nitro.html")),
          viteInspect: fs$1.existsSync(join(dir, ".vite-inspect"))
        }
      };
    }));
    return builds.sort((a, b) => b.endTime - a.endTime);
  }
  async function generateAnalyzeBuildName() {
    try {
      const git = Git(nuxt.options.rootDir);
      const branch = await git.branch();
      const branchName = branch.current || "head";
      const sha = await git.revparse(["--short", "HEAD"]);
      const isWorkingTreeClean = (await git.status()).isClean();
      if (isWorkingTreeClean)
        return `${branchName}#${sha}`;
      return `${branchName}#${sha}-dirty`;
    } catch {
      return (/* @__PURE__ */ new Date()).toISOString().replace(/:/g, "-");
    }
  }
  return {
    async getAnalyzeBuildInfo() {
      if (!initalized)
        initalized = readBuildInfo();
      await initalized;
      return {
        isBuilding: !!promise,
        builds
      };
    },
    async clearAnalyzeBuilds(token, names) {
      await ensureDevAuthToken(token);
      if (!names) {
        await fs.rm(analyzeDir, { recursive: true, force: true });
      } else {
        const targets = builds.filter((build) => names.includes(build.name));
        await Promise.all(targets.map((target) => fs.rm(join(analyzeDir, target.slug), { recursive: true, force: true })));
      }
      initalized = readBuildInfo();
      refresh("getAnalyzeBuildInfo");
    },
    generateAnalyzeBuildName,
    async startAnalyzeBuild(token, ...args) {
      await ensureDevAuthToken(token);
      return startAnalyzeBuild(...args);
    }
  };
}

function setupAssetsRPC({ nuxt, ensureDevAuthToken, refresh, options }) {
  const _imageMetaCache = /* @__PURE__ */ new Map();
  let cache = null;
  const extensions = options.assets?.uploadExtensions || defaultAllowedExtensions;
  const publicDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public);
  const layerDirs = [publicDir, ...nuxt.options._layers.map((layer) => resolve(layer.cwd, "public"))];
  const refreshDebounced = debounce(() => {
    cache = null;
    refresh("getStaticAssets");
  }, 500);
  nuxt.hook("builder:watch", (event, key) => {
    key = relative(nuxt.options.srcDir, resolve(nuxt.options.srcDir, key));
    if (key.startsWith(nuxt.options.dir.public) && (event === "add" || event === "unlink"))
      refreshDebounced();
  });
  async function scan() {
    if (cache)
      return cache;
    const baseURL = nuxt.options.app.baseURL;
    const dirs = [];
    for (const layerDir of layerDirs) {
      const files = await glob(["**/*"], {
        cwd: layerDir,
        onlyFiles: true
      });
      dirs.push({ layerDir, files });
    }
    const uniquePaths = /* @__PURE__ */ new Set();
    cache = [];
    for (const { layerDir, files } of dirs) {
      for (const path of files) {
        const filePath = resolve(layerDir, path);
        const stat = await fs.lstat(filePath);
        const fullPath = join(baseURL, path);
        if (!uniquePaths.has(fullPath)) {
          cache.push({
            path,
            publicPath: fullPath,
            filePath,
            type: guessType(path),
            size: stat.size,
            mtime: stat.mtimeMs,
            layer: publicDir !== layerDir ? layerDir : void 0
          });
          uniquePaths.add(fullPath);
        }
      }
    }
    return cache.sort((a, b) => a.path.localeCompare(b.path));
  }
  return {
    async getStaticAssets() {
      return await scan();
    },
    async getImageMeta(token, filepath) {
      await ensureDevAuthToken(token);
      if (_imageMetaCache.has(filepath))
        return _imageMetaCache.get(filepath);
      try {
        const meta = imageMeta(await fs.readFile(filepath));
        _imageMetaCache.set(filepath, meta);
        return meta;
      } catch (e) {
        _imageMetaCache.set(filepath, void 0);
        console.error(e);
        return void 0;
      }
    },
    async getTextAssetContent(token, filepath, limit = 300) {
      await ensureDevAuthToken(token);
      try {
        const content = await fs.readFile(filepath, "utf-8");
        return content.slice(0, limit);
      } catch (e) {
        console.error(e);
        return void 0;
      }
    },
    async writeStaticAssets(token, files, folder) {
      await ensureDevAuthToken(token);
      const baseDir = resolve(nuxt.options.srcDir, nuxt.options.dir.public + folder);
      return await Promise.all(
        files.map(async ({ path, content, encoding, override }) => {
          let finalPath = resolve(baseDir, path);
          const { ext } = parse(finalPath);
          if (extensions !== "*") {
            if (!extensions.includes(ext.toLowerCase().slice(1)))
              throw new Error(`File extension ${ext} is not allowed to upload, allowed extensions are: ${extensions.join(", ")}
You can configure it in Nuxt config at \`devtools.assets.uploadExtensions\`.`);
          }
          if (!override) {
            try {
              await fs.stat(finalPath);
              const base = finalPath.slice(0, finalPath.length - ext.length - 1);
              let i = 1;
              while (await fs.access(`${base}-${i}.${ext}`).then(() => true).catch(() => false))
                i++;
              finalPath = `${base}-${i}.${ext}`;
            } catch {
            }
          }
          await fs.writeFile(finalPath, content, {
            encoding: encoding ?? "utf-8"
          });
          return finalPath;
        })
      );
    },
    async deleteStaticAsset(token, path) {
      await ensureDevAuthToken(token);
      return await fs.unlink(path);
    },
    async renameStaticAsset(token, oldPath, newPath) {
      await ensureDevAuthToken(token);
      const exist = cache?.find((asset) => asset.filePath === newPath);
      if (exist)
        throw new Error(`File ${newPath} already exists`);
      return await fs.rename(oldPath, newPath);
    }
  };
}
const reImage = /\.(?:png|jpe?g|jxl|gif|svg|webp|avif|ico|bmp|tiff?)$/i;
const reVideo = /\.(?:mp4|webm|ogv|mov|avi|flv|wmv|mpg|mpeg|mkv|3gp|3g2|ts|mts|m2ts|vob|ogm|ogx|rm|rmvb|asf|amv|divx|m4v|svi|viv|f4v|f4p|f4a|f4b)$/i;
const reAudio = /\.(?:mp3|wav|ogg|flac|aac|wma|alac|ape|ac3|dts|tta|opus|amr|aiff|au|mid|midi|ra|rm|wv|weba|dss|spx|vox|tak|dsf|dff|dsd|cda)$/i;
const reFont = /\.(?:woff2?|eot|ttf|otf|ttc|pfa|pfb|pfm|afm)/i;
const reText = /\.(?:json[5c]?|te?xt|[mc]?[jt]sx?|md[cx]?|markdown)/i;
function guessType(path) {
  if (reImage.test(path))
    return "image";
  if (reVideo.test(path))
    return "video";
  if (reAudio.test(path))
    return "audio";
  if (reFont.test(path))
    return "font";
  if (reText.test(path))
    return "text";
  return "other";
}

function setupCustomTabRPC({ nuxt, options, refresh }) {
  const iframeTabs = [];
  const customTabs = [];
  if (options.customTabs?.length)
    customTabs.push(...options.customTabs);
  async function initHooks() {
    nuxt.hook("devtools:customTabs:refresh", initCustomTabs);
    await initCustomTabs();
  }
  async function initCustomTabs() {
    customTabs.length = 0;
    if (options.customTabs?.length)
      customTabs.push(...options.customTabs);
    await nuxt.callHook("devtools:customTabs", customTabs);
    refresh("getCustomTabs");
  }
  nuxt.hook("app:resolve", async () => {
    await initHooks();
  });
  return {
    getCustomTabs() {
      return [
        ...iframeTabs,
        ...customTabs
      ].map((i) => {
        i.category = i.category || "modules";
        return i;
      });
    },
    async customTabAction(name, actionIndex) {
      const tab = customTabs.find((i) => i.name === name);
      if (!tab)
        return false;
      const view = tab.view;
      if (view.type !== "launch")
        return false;
      const action = view.actions?.[actionIndex];
      if (!action)
        return false;
      Promise.resolve(action.handle?.()).catch((e) => {
        console.error(e);
      }).finally(() => {
        nuxt.callHook("devtools:customTabs:refresh");
      });
      nuxt.callHook("devtools:customTabs:refresh");
      return true;
    }
  };
}

function setupGeneralRPC({
  nuxt,
  options,
  refresh,
  ensureDevAuthToken,
  openInEditorHooks
}) {
  const components = [];
  const imports = [];
  const importPresets = [];
  let importDirs = [];
  const serverPages = [];
  let serverApp;
  const serverHooks = setupHooksDebug(nuxt.hooks);
  let unimport;
  let app;
  nuxt.hook("components:extend", (v) => {
    components.length = 0;
    components.push(...v);
    components.sort((a, b) => a.pascalName.localeCompare(b.pascalName));
    refresh("getComponents");
  });
  nuxt.hook("imports:extend", (v) => {
    imports.length = 0;
    imports.push(...v);
    refresh("getAutoImports");
  });
  nuxt.hook("pages:extend", (v) => {
    serverPages.length = 0;
    const pagesSet = new Set(v);
    function searchChildren(page) {
      if (pagesSet.has(page))
        return;
      pagesSet.add(page);
      page.children?.forEach(searchChildren);
    }
    v.forEach(searchChildren);
    serverPages.push(...Array.from(pagesSet).sort((a, b) => a.path.localeCompare(b.path)));
    refresh("getServerPages");
  });
  nuxt.hook("app:resolve", (app2) => {
    serverApp = app2;
  });
  nuxt.hook("imports:sources", async (v) => {
    const result = (await resolveBuiltinPresets(v)).flat();
    importPresets.length = 0;
    importPresets.push(...result);
    refresh("getAutoImports");
  });
  nuxt.hook("imports:context", (_unimport) => {
    unimport = _unimport;
  });
  nuxt.hook("imports:dirs", (dirs) => {
    importDirs = dirs;
  });
  nuxt.hook("app:resolve", (v) => {
    app = v;
  });
  return {
    getServerConfig() {
      return nuxt.options;
    },
    getServerRuntimeConfig() {
      const ENV_PREFIX = "NITRO_";
      const ENV_PREFIX_ALT = "NUXT_";
      function _getEnv(key) {
        const envKey = snakeCase(key).toUpperCase();
        return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
      }
      function _isObject(input) {
        return typeof input === "object" && !Array.isArray(input);
      }
      function _applyEnv(obj, parentKey = "") {
        for (const key in obj) {
          const subKey = parentKey ? `${parentKey}_${key}` : key;
          const envValue = _getEnv(subKey);
          if (_isObject(obj[key])) {
            if (_isObject(envValue))
              obj[key] = { ...obj[key], ...envValue };
            _applyEnv(obj[key], subKey);
          } else {
            obj[key] = envValue ?? obj[key];
          }
        }
        return obj;
      }
      const runtime = { ...nuxt.options.runtimeConfig };
      _applyEnv(runtime);
      return runtime;
    },
    getModuleOptions() {
      return options;
    },
    getServerApp() {
      return serverApp;
    },
    getComponents() {
      return components;
    },
    async getComponentsRelationships() {
      return [];
    },
    getServerPages() {
      return serverPages;
    },
    getAutoImports() {
      return {
        imports: [
          ...imports,
          ...importPresets
        ],
        metadata: unimport?.getMetadata(),
        dirs: importDirs
      };
    },
    getServerLayouts() {
      return Object.values(app?.layouts || []);
    },
    getServerHooks() {
      return Object.values(serverHooks);
    },
    async openInEditor(input) {
      if (input.startsWith("./"))
        input = resolve(process.cwd(), input);
      const match = input.match(/^(.*?)(:[:\d]*)$/);
      let suffix = "";
      if (match) {
        input = match[1];
        suffix = match[2];
      }
      const path = [
        input,
        `${input}.js`,
        `${input}.mjs`,
        `${input}.ts`
      ].find((i) => existsSync(i));
      if (!path) {
        console.error("File not found:", input);
        return false;
      }
      try {
        for (const hook of openInEditorHooks) {
          const result = await hook(path + suffix);
          if (result)
            return true;
        }
        await import('launch-editor').then((r) => (r.default || r)(path + suffix));
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    async restartNuxt(token, hard = true) {
      await ensureDevAuthToken(token);
      logger.info("Restarting Nuxt...");
      return nuxt.callHook("restart", { hard });
    },
    async requestForAuth(info, origin) {
      if (options.disableAuthorization)
        return;
      const token = await getDevAuthToken();
      origin ||= `${nuxt.options.devServer.https ? "https" : "http"}://${nuxt.options.devServer.host === "::" ? "localhost" : nuxt.options.devServer.host || "localhost"}:${nuxt.options.devServer.port}`;
      const ROUTE_AUTH = `${nuxt.options.app.baseURL || "/"}/__nuxt_devtools__/auth`.replace(/\/+/g, "/");
      const message = [
        `A browser is requesting permissions of ${colors.bold(colors.yellow("writing files and running commands"))} from the DevTools UI.`,
        colors.bold(info || "Unknown"),
        "",
        "Please open the following URL in the browser:",
        colors.bold(colors.green(`${origin}${ROUTE_AUTH}?token=${token}`)),
        "",
        "Or manually copy and paste the following token:",
        colors.bold(colors.cyan(token))
      ];
      logger.box({
        message: message.join("\n"),
        title: colors.bold(colors.yellow(" Permission Request ")),
        style: {
          borderColor: "yellow",
          borderStyle: "rounded"
        }
      });
    },
    async verifyAuthToken(token) {
      if (options.disableAuthorization)
        return true;
      return token === await getDevAuthToken();
    }
  };
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/");
  }
  return TRAILING_SLASH_RE.test(input);
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
  if (!hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
  }
  const [s0, ...s] = path.split("?");
  const cleanPath = s0.endsWith("/") ? s0.slice(0, -1) : s0;
  return (cleanPath || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  if (!respectQueryAndFragment) {
    return input.endsWith("/") ? input : input + "/";
  }
  if (hasTrailingSlash(input, true)) {
    return input || "/";
  }
  let path = input;
  let fragment = "";
  const fragmentIndex = input.indexOf("#");
  if (fragmentIndex >= 0) {
    path = input.slice(0, fragmentIndex);
    fragment = input.slice(fragmentIndex);
    if (!path) {
      return fragment;
    }
  }
  const [s0, ...s] = path.split("?");
  return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

const _globalThis = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis.fetch ? (...args) => _globalThis.fetch(...args) : () => Promise.reject(new Error("[ofetch] global.fetch is not supported!"));
const Headers = _globalThis.Headers;
const AbortController = _globalThis.AbortController;
createFetch({ fetch, Headers, AbortController });

async function checkForUpdateOf(name, current, nuxt = useNuxt()) {
  try {
    if (!current) {
      const require = createRequire(nuxt.options.rootDir);
      const info = await getPackageInfo(name, { paths: require.resolve.paths(name) || void 0 });
      if (!info)
        return;
      current = info.packageJson.version;
    }
    if (!current)
      return;
    const { getLatestVersion } = await import('fast-npm-meta');
    const { version: latest } = await getLatestVersion(name, {
      fetch
    });
    const needsUpdate = !!latest && latest !== current && semver.lt(current, latest);
    return {
      name,
      current,
      latest: latest || current,
      needsUpdate
    };
  } catch (e) {
    logger.warn(`Failed to check for update of ${name}:`);
    logger.warn(e);
  }
}

async function magicastGuard(fn, message = "") {
  let generated;
  try {
    generated = await fn();
  } catch (e) {
    logger.error(e);
    throw new Error(`Magicast failed to modify Nuxt config automatically. Maybe the config are composed too dynamically that we failed to statically analyze it. ${message}`);
  }
  return generated;
}

function setupNpmRPC({ nuxt, ensureDevAuthToken }) {
  let detectPromise;
  const updatesPromise = /* @__PURE__ */ new Map();
  function getPackageManager() {
    detectPromise ||= detectPackageManager(nuxt.options.rootDir);
    return detectPromise;
  }
  async function getNpmCommand(command, packageName, options = {}) {
    const {
      dev = true,
      global = packageName === "@nuxt/devtools" && isInstalledGlobally
    } = options;
    const agent = await getPackageManager();
    const name = agent?.name || "npm";
    if (command === "install" || command === "update") {
      return [
        name,
        name === "npm" ? "install" : "add",
        `${packageName}@latest`,
        dev ? "-D" : "",
        global ? "-g" : "",
        // In yarn berry, `--ignore-scripts` is removed
        name === "yarn" && !agent?.version?.startsWith("1.") ? "" : "--ignore-scripts"
      ].filter(Boolean);
    }
    if (command === "uninstall") {
      return [
        name,
        name === "npm" ? "uninstall" : "remove",
        packageName,
        global ? "-g" : ""
      ].filter(Boolean);
    }
  }
  async function runNpmCommand(command, packageName, options = {}) {
    const args = await getNpmCommand(command, packageName, options);
    if (!args)
      return;
    const processId = `npm:${command}:${packageName}`;
    startSubprocess({
      command: args[0],
      args: args.slice(1)
    }, {
      id: processId,
      name: `${command} ${packageName}`,
      icon: "i-logos-npm-icon",
      restartable: false
    });
    return {
      processId
    };
  }
  const installSet = /* @__PURE__ */ new Set();
  let latestGenerated = null;
  return {
    checkForUpdateFor(name) {
      if (!updatesPromise.has(name))
        updatesPromise.set(name, checkForUpdateOf(name, void 0, nuxt));
      return updatesPromise.get(name);
    },
    getNpmCommand,
    async runNpmCommand(token, ...args) {
      await ensureDevAuthToken(token);
      return runNpmCommand(...args);
    },
    async installNuxtModule(token, name, dry = true) {
      await ensureDevAuthToken(token);
      const commands = await getNpmCommand("install", name, { dev: true });
      const filepath = nuxt.options._nuxtConfigFile;
      let source = latestGenerated;
      if (source == null)
        source = await fs.readFile(filepath, "utf-8");
      const generated = await magicastGuard(async () => {
        const mod = parseModule(source, { sourceFileName: filepath });
        addNuxtModule(mod, name);
        return mod.generate().code;
      });
      const processId = `nuxt:add-module:${name}`;
      if (!dry) {
        latestGenerated = generated;
        installSet.add(name);
        const process = startSubprocess({
          command: commands[0],
          args: commands.slice(1)
        }, {
          id: processId,
          name: `Install ${name}`,
          icon: "carbon:intent-request-create",
          restartable: false
        });
        const execa = process.getProcess();
        const result = await execa;
        await Promise.resolve();
        installSet.delete(name);
        const code = result.exitCode;
        if (code !== 0) {
          console.error(result.stderr);
          throw new Error(`Failed to install module, process exited with ${code}`);
        }
        if (installSet.size === 0) {
          latestGenerated = null;
          await fs.writeFile(filepath, generated, "utf-8");
        }
      }
      return {
        configOriginal: source,
        configGenerated: generated,
        commands,
        processId
      };
    },
    async uninstallNuxtModule(token, name, dry = true) {
      await ensureDevAuthToken(token);
      const commands = await getNpmCommand("uninstall", name);
      const filepath = nuxt.options._nuxtConfigFile;
      const source = await fs.readFile(filepath, "utf-8");
      const generated = await magicastGuard(async () => {
        const mod = parseModule(source, { sourceFileName: filepath });
        const config = getDefaultExportOptions(mod);
        config.modules ||= [];
        if (config.modules.includes(name)) {
          Object.values(config.modules).forEach((value, index) => {
            if (value === name)
              config.modules.splice(index - 1, 1);
          });
        }
        return mod.generate().code;
      });
      const processId = `nuxt:remove-module:${name}`;
      if (!dry) {
        const process = startSubprocess({
          command: commands[0],
          args: commands.slice(1)
        }, {
          id: processId,
          name: `Uninstall ${name}`,
          icon: "carbon:intent-request-uninstall",
          restartable: false
        });
        const execa = process.getProcess();
        const result = await execa;
        await Promise.resolve();
        const code = result.exitCode;
        if (code !== 0) {
          console.error(result.stderr);
          throw new Error(`Failed to uninstall module', process exited with ${code}`);
        }
        await fs.writeFile(filepath, generated, "utf-8");
      }
      return {
        configOriginal: source,
        configGenerated: generated,
        commands,
        processId
      };
    }
  };
}

let options;
function getOptions() {
  return options;
}
function setupOptionsRPC({ nuxt }) {
  async function getOptions2(tab) {
    if (!options || options[tab]) {
      options = defaultTabOptions;
      await read(tab);
    }
    return options[tab];
  }
  async function read(tab) {
    options[tab] = await readLocalOptions(defaultTabOptions[tab], {
      root: nuxt.options.rootDir,
      key: tab !== "ui" && tab
    });
    return options;
  }
  getOptions2("ui");
  async function clearOptions() {
    options = void 0;
    await clearLocalOptions({
      root: nuxt.options.rootDir
    });
  }
  return {
    async updateOptions(tab, _settings) {
      const settings = await getOptions2(tab);
      Object.assign(settings, _settings);
      await writeLocalOptions(
        { ...settings },
        {
          root: nuxt.options.rootDir,
          key: tab !== "ui" && tab
        }
      );
      nuxt.callHook("builder:generateApp", {
        filter(template) {
          return template.filename.includes("devtools/settings.js");
        }
      });
    },
    getOptions: getOptions2,
    clearOptions
  };
}

function setupServerRoutesRPC({ nuxt, refresh }) {
  let nitro;
  let cache = null;
  const refreshDebounced = debounce(() => {
    cache = null;
    refresh("getServerRoutes");
  }, 500);
  nuxt.hook("nitro:init", (_) => {
    nitro = _;
    cache = null;
    refresh("getServerRoutes");
  });
  nuxt.hook("ready", () => {
    nitro?.storage.watch((event, key) => {
      if (key.startsWith("src:api:") || key.startsWith("src:routes:"))
        refreshDebounced();
    });
  });
  function scan() {
    if (cache)
      return cache;
    cache = (() => {
      if (!nitro)
        return [];
      return [
        ...nitro.scannedHandlers.filter((item) => !item.middleware).map((item) => ({
          route: item.route,
          filepath: item.handler,
          method: item.method,
          type: item.route?.startsWith("/api") ? "api" : "route"
        })),
        ...nitro.options.handlers.filter((item) => !item.route?.startsWith("/_nitro") && !item.route?.startsWith("/__nuxt") && !item.middleware).map((item) => ({
          route: item.route,
          filepath: item.handler,
          method: item.method,
          type: "runtime"
        }))
      ];
    })();
    return cache;
  }
  return {
    getServerRoutes() {
      return scan();
    }
  };
}

function setupServerTasksRPC({ nuxt, refresh }) {
  let nitro;
  let cache = null;
  const refreshDebounced = debounce(() => {
    cache = null;
    refresh("getServerTasks");
  }, 500);
  nuxt.hook("nitro:init", (_) => {
    nitro = _;
    cache = null;
    refresh("getServerTasks");
  });
  nuxt.hook("ready", () => {
    nitro?.storage.watch((event, key) => {
      if (key.startsWith("src:tasks:"))
        refreshDebounced();
    });
  });
  function scan() {
    if (cache)
      return cache;
    cache = (() => {
      if (!nitro) {
        return {
          tasks: {},
          scheduledTasks: {}
        };
      }
      return {
        tasks: nitro.options.tasks,
        scheduledTasks: Object.entries(nitro.options.scheduledTasks ?? {}).reduce((acc, [cron, tasks]) => {
          acc[cron] = Array.isArray(tasks) ? tasks : [tasks];
          return acc;
        }, {})
      };
    })();
    return cache;
  }
  return {
    getServerTasks() {
      return scan();
    }
  };
}

const IGNORE_STORAGE_MOUNTS = ["root", "build", "src", "cache"];
function shouldIgnoreStorageKey(key) {
  return IGNORE_STORAGE_MOUNTS.includes(key.split(":")[0]);
}
function setupStorageRPC({
  nuxt,
  rpc,
  ensureDevAuthToken
}) {
  const storageMounts = {};
  let storage;
  nuxt.hook("nitro:init", (nitro) => {
    storage = nitro.storage;
    nuxt.hook("ready", () => {
      storage.watch((event, key) => {
        if (shouldIgnoreStorageKey(key))
          return;
        rpc.broadcast.callHook.asEvent("storage:key:update", key, event);
      });
    });
    const mounts = {
      ...nitro.options.storage,
      ...nitro.options.devStorage
    };
    for (const name of Object.keys(mounts)) {
      if (shouldIgnoreStorageKey(name))
        continue;
      storageMounts[name] = mounts[name];
    }
  });
  return {
    async getStorageMounts() {
      return storageMounts;
    },
    async getStorageKeys(base) {
      if (!storage)
        return [];
      try {
        const keys = await storage.getKeys(base);
        return keys.filter((key) => !shouldIgnoreStorageKey(key));
      } catch (err) {
        console.error(`Cloud not fetch storage keys for ${base}:`, err);
        return [];
      }
    },
    async getStorageItem(token, key) {
      await ensureDevAuthToken(token);
      if (!storage)
        return null;
      return await storage.getItem(key);
    },
    async setStorageItem(token, key, value) {
      await ensureDevAuthToken(token);
      if (!storage)
        return;
      return await storage.setItem(key, value);
    },
    async removeStorageItem(token, key) {
      await ensureDevAuthToken(token);
      if (!storage)
        return;
      return await storage.removeItem(key);
    }
  };
}

const SEND_DELAY = 5e3;
function throttle(fn, delay) {
  let timer;
  return () => {
    if (!timer) {
      timer = setTimeout(() => {
        timer = void 0;
        fn();
      }, delay);
    }
  };
}
let telemetry;
const throttledSend = throttle(() => {
  telemetry?.sendEvents();
}, SEND_DELAY);
function setupTelemetryRPC({ nuxt, options }) {
  if (options.telemetry !== false) {
    nuxt.hook("telemetry:setup", (t) => {
      telemetry = t;
      t.eventFactories.devtools = (_, payload) => {
        return {
          name: "devtools",
          version,
          ...payload
        };
      };
      t.createEvent("devtools", { event: "enabled" });
    });
  }
  return {
    telemetryEvent(payload, immediate = false) {
      telemetryEvent(payload, immediate);
    }
  };
}
function telemetryEvent(payload, immediate = false) {
  if (!telemetry)
    return;
  if (getOptions()?.behavior.telemetry === false)
    return;
  telemetry.createEvent("devtools", payload);
  if (immediate)
    telemetry.sendEvents();
  else
    throttledSend();
}

function setupTerminalRPC({ nuxt, rpc, refresh, ensureDevAuthToken }) {
  const terminals = /* @__PURE__ */ new Map();
  nuxt.hook("devtools:terminal:register", (terminal) => {
    terminals.set(terminal.id, terminal);
    refresh("getTerminals");
    return terminal.id;
  });
  nuxt.hook("devtools:terminal:remove", ({ id }) => {
    if (!terminals.has(id))
      return false;
    terminals.delete(id);
    refresh("getTerminals");
    return true;
  });
  nuxt.hook("devtools:terminal:write", ({ id, data }) => {
    const terminal = terminals.get(id);
    if (!terminal)
      return false;
    terminal.buffer ||= "";
    terminal.buffer += data;
    rpc.broadcast.onTerminalData.asEvent({ id, data });
    return true;
  });
  nuxt.hook("devtools:terminal:exit", ({ id, code }) => {
    const terminal = terminals.get(id);
    if (!terminal)
      return false;
    terminal.isTerminated = true;
    rpc.broadcast.onTerminalExit.asEvent({ id, code });
    refresh("getTerminals");
    return true;
  });
  function serializeTerminal(terminal, buffer = false) {
    if (!terminal)
      return;
    return {
      id: terminal.id,
      name: terminal.name,
      description: terminal.description,
      icon: terminal.icon,
      terminatable: terminal.terminatable ?? !!terminal.onActionTerminate,
      restartable: terminal.restartable ?? !!terminal.onActionRestart,
      isTerminated: terminal.isTerminated,
      buffer: buffer ? terminal.buffer : void 0
    };
  }
  return {
    getTerminals() {
      return Array.from(terminals.values()).map((i) => serializeTerminal(i));
    },
    async getTerminalDetail(token, id) {
      await ensureDevAuthToken(token);
      return serializeTerminal(terminals.get(id), true);
    },
    async runTerminalAction(token, id, action) {
      await ensureDevAuthToken(token);
      const terminal = terminals.get(id);
      if (!terminal)
        return false;
      switch (action) {
        case "restart":
          if (!terminal.onActionRestart)
            return false;
          await terminal.onActionRestart();
          return true;
        case "terminate":
          if (!terminal.onActionTerminate)
            return false;
          await terminal.onActionTerminate();
          return true;
        case "remove":
          if (!terminal.isTerminated)
            terminal.onActionTerminate?.();
          terminals.delete(id);
          refresh("getTerminals");
          return true;
        case "clear":
          terminal.buffer = "";
          refresh("getTerminals");
          return true;
      }
    }
  };
}

function setupTimelineRPC({ nuxt }) {
  return {
    async enableTimeline(dry) {
      const filepath = nuxt.options._nuxtConfigFile;
      const source = await fs.readFile(filepath, "utf-8");
      const generated = await magicastGuard(async () => {
        const mod = parseModule(source, { sourceFileName: filepath });
        const options = getDefaultExportOptions(mod);
        options.devtools = options.devtools || {};
        options.devtools.timeline = options.devtools.timeline || {};
        options.devtools.timeline.enabled = true;
        return mod.generate().code;
      }, "\nYou can enable timeline manually by adding `devtools: { timeline: { enabled: true } }`");
      if (!dry) {
        await fs.writeFile(filepath, generated, "utf-8");
        await nuxt.callHook("restart", { hard: true });
      }
      return [source, generated];
    }
  };
}

const LOG_PREFIX = colors.cyan("Nuxt DevTools:");

const pagesIndexTemplate = `<script setup lang="ts">
const route = useRoute()
<\/script>

<template>
  <div>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <a href="https://nuxt.com/docs/getting-started/routing" target="_blank">Learn more about Nuxt Routing</a>
  </div>
</template>
`;
async function enablePages(nuxt) {
  const baseDir = nuxt.options.future.compatibilityVersion === 4 ? nuxt.options.dir.app : nuxt.options.srcDir;
  const pathApp = join(baseDir, "app.vue");
  const pathPageIndex = join(baseDir, "pages/index.vue");
  if (fs$1.existsSync(pathPageIndex)) {
    logger.warn("pages/index.vue already exists, skipping");
    return;
  }
  let appContent = fs$1.existsSync(pathApp) ? await fs.readFile(pathApp, "utf-8") : void 0;
  await fs.mkdir(dirname$1(pathPageIndex), { recursive: true });
  await fs.writeFile(pathPageIndex, pagesIndexTemplate, "utf-8");
  if (appContent && !appContent.includes("<NuxtPage")) {
    appContent = appContent.replace("</template>", "  <NuxtPage />\n</template>").replace(/<NuxtWelcome\s*\/>/, "");
    await fs.writeFile(pathApp, appContent, "utf-8");
  }
  logger.success("Routing creation wizard completed");
}

const wizard = {
  enablePages
};

function setupWizardRPC({ nuxt, ensureDevAuthToken }) {
  return {
    async runWizard(token, name, ...args) {
      await ensureDevAuthToken(token);
      logger.info(LOG_PREFIX, `Running wizard ${colors.green(name)}...`);
      return wizard[name](nuxt, ...args);
    }
  };
}

function setupRPC(nuxt, options) {
  const serverFunctions = {};
  const extendedRpcMap = /* @__PURE__ */ new Map();
  const rpc = createBirpcGroup(
    serverFunctions,
    [],
    {
      resolver: (name, fn) => {
        if (fn)
          return fn;
        if (!name.includes(":"))
          return;
        const [namespace, fnName] = name.split(":");
        return extendedRpcMap.get(namespace)?.[fnName];
      },
      onError(error, name) {
        logger.error(
          colors.yellow(`[nuxt-devtools] RPC error on executing "${colors.bold(name)}":
`) + colors.red(error?.message || "")
        );
      },
      timeout: 12e4
    }
  );
  function refresh(event) {
    rpc.broadcast.refresh.asEvent(event);
  }
  function extendServerRpc(namespace, functions) {
    extendedRpcMap.set(namespace, functions);
    return {
      broadcast: new Proxy({}, {
        get: (_, key) => {
          if (typeof key !== "string")
            return;
          return rpc.broadcast[`${namespace}:${key}`];
        }
      })
    };
  }
  const ctx = {
    nuxt,
    options,
    rpc,
    refresh,
    extendServerRpc,
    openInEditorHooks: [],
    async ensureDevAuthToken(token) {
      if (options.disableAuthorization)
        return;
      if (token !== await getDevAuthToken())
        throw new Error("Invalid dev auth token.");
    }
  };
  nuxt.devtools = ctx;
  Object.assign(serverFunctions, {
    ...setupGeneralRPC(ctx),
    ...setupCustomTabRPC(ctx),
    ...setupStorageRPC(ctx),
    ...setupAssetsRPC(ctx),
    ...setupNpmRPC(ctx),
    ...setupWizardRPC(ctx),
    ...setupTerminalRPC(ctx),
    ...setupServerRoutesRPC(ctx),
    ...setupServerTasksRPC(ctx),
    ...setupAnalyzeBuildRPC(ctx),
    ...setupOptionsRPC(ctx),
    ...setupTimelineRPC(ctx),
    ...setupTelemetryRPC(ctx)
  });
  const wsClients = /* @__PURE__ */ new Set();
  const vitePlugin = {
    name: "nuxt:devtools:rpc",
    configureServer(server) {
      server.ws.on("connection", (ws) => {
        wsClients.add(ws);
        const channel = {
          post: (d) => ws.send(JSON.stringify({
            type: "custom",
            event: WS_EVENT_NAME,
            data: d
          })),
          on: (fn) => {
            ws.on("message", (e) => {
              try {
                const data = JSON.parse(String(e)) || {};
                if (data.type === "custom" && data.event === WS_EVENT_NAME) {
                  fn(data.data);
                }
              } catch {
              }
            });
          },
          serialize: stringify,
          deserialize: parse$1
        };
        rpc.updateChannels((c) => {
          c.push(channel);
        });
        ws.on("close", () => {
          wsClients.delete(ws);
          rpc.updateChannels((c) => {
            const index = c.indexOf(channel);
            if (index >= 0)
              c.splice(index, 1);
          });
        });
      });
    }
  };
  return {
    vitePlugin,
    ...ctx
  };
}

async function enableModule(options, nuxt) {
  if (process.env.TEST || process.env.NODE_ENV === "test" || nuxt.options.test)
    return;
  if (nuxt.options.builder !== "@nuxt/vite-builder") {
    logger.warn("Nuxt DevTools only supports Vite mode, module is disabled.");
    return;
  }
  if (!nuxt.options.dev) {
    if (nuxt.options.build.analyze && (nuxt.options.build.analyze === true || nuxt.options.build.analyze.enabled))
      await import('./analyze-build.mjs').then(({ setup }) => setup(nuxt, options));
    return;
  }
  const enabledExplicitly = nuxt.options.devtools === true || nuxt.options.devtools && nuxt.options.devtools.enabled || !!nuxt.options.modules.find((m) => m === "@nuxt/devtools" || m === "@nuxt/devtools-edge");
  await nuxt.callHook("devtools:before");
  if (options.iframeProps) {
    nuxt.options.runtimeConfig.app.devtools ||= {};
    nuxt.options.runtimeConfig.app.devtools.iframeProps = options.iframeProps;
  }
  nuxt.options.imports.collectMeta = true;
  addPlugin({
    src: join(runtimeDir, "plugins/devtools.client"),
    mode: "client"
  });
  addPlugin({
    src: join(runtimeDir, "plugins/devtools.server"),
    mode: "server"
  });
  addTemplate({
    filename: "devtools/settings.mjs",
    async getContents() {
      const uiOptions = await readLocalOptions(
        {
          ...defaultTabOptions.ui,
          // When not enabled explicitly, we hide the panel by default
          showPanel: enabledExplicitly ? true : null
        },
        { root: nuxt.options.rootDir }
      );
      return `export default ${JSON.stringify({
        ui: uiOptions
      })}`;
    }
  });
  nuxt.hook("nitro:config", (config) => {
    if (config.experimental?.tasks)
      defaultTabOptions.serverTasks.enabled = true;
    config.externals = config.externals || {};
    config.externals.inline = config.externals.inline || [];
    config.externals.inline.push(join(runtimeDir, "nitro"));
    config.virtual = config.virtual || {};
    config.virtual["#nuxt-devtools-inline"] = `export const script = \`
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
\``;
    config.plugins = config.plugins || [];
    config.plugins.unshift(join(runtimeDir, "nitro/inline"));
  });
  const {
    vitePlugin,
    ...ctx
  } = setupRPC(nuxt, options);
  addVitePlugin(vitePlugin);
  const clientDirExists = existsSync(clientDir);
  const analyzeDir = join(nuxt.options.rootDir, ".nuxt/analyze");
  nuxt.hook("vite:extendConfig", (config) => {
    config.server ||= {};
    config.server.fs ||= {};
    config.server.fs.allow ||= [
      searchForWorkspaceRoot(process.cwd())
    ];
    config.server.fs.allow.push(packageDir);
    config.server.watch ||= {};
    config.server.watch.ignored ||= [];
    if (!Array.isArray(config.server.watch.ignored))
      config.server.watch.ignored = [config.server.watch.ignored];
    config.server.watch.ignored.push("**/.nuxt/analyze/**");
  });
  nuxt.hook("imports:extend", (imports) => {
    imports.push({
      name: "useNuxtDevTools",
      from: join(runtimeDir, "use-nuxt-devtools")
    });
  });
  const ROUTE_PATH = `${nuxt.options.app.baseURL || "/"}/__nuxt_devtools__`.replace(/\/+/g, "/");
  const ROUTE_CLIENT = `${ROUTE_PATH}/client`;
  const ROUTE_AUTH = `${ROUTE_PATH}/auth`;
  const ROUTE_AUTH_VERIFY = `${ROUTE_PATH}/auth-verify`;
  const ROUTE_ANALYZE = `${ROUTE_PATH}/analyze`;
  nuxt.hook("vite:serverCreated", (server) => {
    server.middlewares.use(ROUTE_ANALYZE, sirv(analyzeDir, { single: false, dev: true }));
    if (clientDirExists) {
      const indexHtmlPath = join(clientDir, "index.html");
      const indexContent = fs.readFile(indexHtmlPath, "utf-8");
      const handleStatic = sirv(clientDir, {
        dev: true,
        single: false
      });
      const handleIndex = async (res) => {
        res.setHeader("Content-Type", "text/html");
        res.statusCode = 200;
        res.write((await indexContent).replace(/\/__NUXT_DEVTOOLS_BASE__\//g, `${ROUTE_CLIENT}/`));
        res.end();
      };
      server.middlewares.use(ROUTE_CLIENT, (req, res) => {
        if (req.url === "/")
          return handleIndex(res);
        return handleStatic(req, res, () => handleIndex(res));
      });
    }
    server.middlewares.use(ROUTE_AUTH, sirv(join(runtimeDir, "auth"), { single: true, dev: true }));
    server.middlewares.use(ROUTE_AUTH_VERIFY, async (req, res) => {
      const search = req.url?.split("?")[1];
      if (!search) {
        res.statusCode = 400;
        res.end("No token provided");
      }
      const query = new URLSearchParams(search);
      const token = query.get("token");
      if (!token) {
        res.statusCode = 400;
        res.end("No token provided");
      }
      if (token === await getDevAuthToken()) {
        res.statusCode = 200;
        res.end("Valid token");
      } else {
        res.statusCode = 403;
        res.end("Invalid token");
      }
    });
  });
  await import('./plugin-metrics.mjs').then(({ setup }) => setup(ctx));
  await import('./vue-devtools.mjs').then(({ setup }) => setup(ctx));
  if (options.viteInspect !== false)
    await import('./vite-inspect.mjs').then(({ setup }) => setup(ctx));
  if (options.componentInspector !== false)
    await import('./vue-inspector.mjs').then(({ setup }) => setup(ctx));
  const integrations = [
    options.vscode?.enabled ? import('./vscode.mjs').then(({ setup }) => setup(ctx)) : null,
    options.experimental?.timeline || options.timeline?.enabled ? import('./timeline.mjs').then(({ setup }) => setup(ctx)) : null
  ];
  await Promise.all(integrations);
  await nuxt.callHook("devtools:initialized", {
    version,
    packagePath: packageDir,
    isGlobalInstall: isGlobalInstall()
  });
  const isMac = os.platform() === "darwin";
  logger.log([
    colors.yellow(`  \u279C DevTools: `),
    colors.dim("press "),
    colors.green("Shift"),
    colors.dim(" + "),
    colors.green(isMac ? "Option" : "Alt"),
    colors.dim(" + "),
    colors.green("D"),
    colors.dim(` in the browser (v${version})`),
    "\n"
  ].join(""));
}

const moduleMain = {
  __proto__: null,
  enableModule: enableModule
};

export { LOG_PREFIX as L, moduleMain as m };
