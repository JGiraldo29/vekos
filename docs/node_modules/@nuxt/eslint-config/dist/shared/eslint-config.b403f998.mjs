import { composer } from 'eslint-flat-config-utils';
import gitignore from 'eslint-config-flat-gitignore';
import { join } from 'pathe';
import { isPackageExists } from 'local-pkg';
import nuxtPlugin from '@nuxt/eslint-plugin';
import pluginESLint from '@eslint/js';
import globals from 'globals';

const GLOB_EXTS = "{js,ts,jsx,tsx,vue}";

function removeUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== void 0));
}
function resolveOptions(config) {
  if ("__resolved" in config) {
    return config;
  }
  const dirs = {
    ...config.dirs
  };
  dirs.root || (dirs.root = [".", "./app"]);
  dirs.src || (dirs.src = dirs.root);
  dirs.pages || (dirs.pages = dirs.src.map((src) => `${src}/pages`));
  dirs.layouts || (dirs.layouts = dirs.src.map((src) => `${src}/layouts`));
  dirs.components || (dirs.components = dirs.src.map((src) => `${src}/components`));
  dirs.composables || (dirs.composables = dirs.src.map((src) => `${src}/composables`));
  dirs.plugins || (dirs.plugins = dirs.src.map((src) => `${src}/plugins`));
  dirs.modules || (dirs.modules = dirs.src.map((src) => `${src}/modules`));
  dirs.middleware || (dirs.middleware = dirs.src.map((src) => `${src}/middleware`));
  dirs.servers || (dirs.servers = dirs.src.map((src) => `${src}/servers`));
  dirs.componentsPrefixed || (dirs.componentsPrefixed = []);
  const resolved = {
    features: {
      standalone: true,
      stylistic: false,
      typescript: isPackageExists("typescript"),
      tooling: false,
      nuxt: {},
      ...config.features
    },
    dirs
  };
  Object.defineProperty(resolved, "__resolved", { value: true, enumerable: false });
  return resolved;
}

function disables(options) {
  const resolved = resolveOptions(options);
  const dirs = resolved.dirs;
  const nestedGlobPattern = `**/*.${GLOB_EXTS}`;
  const fileRoutes = [.../* @__PURE__ */ new Set([
    // These files must have one-word names as they have a special meaning in Nuxt.
    ...dirs.src.flatMap((layersDir) => [
      join(layersDir, `app.${GLOB_EXTS}`),
      join(layersDir, `error.${GLOB_EXTS}`)
    ]) || [],
    // Layouts and pages are not used directly by users so they can have one-word names.
    ...dirs.layouts.map((layoutsDir) => join(layoutsDir, nestedGlobPattern)) || [],
    ...dirs.pages.map((pagesDir) => join(pagesDir, nestedGlobPattern)) || [],
    // These files should have multiple words in their names as they are within subdirectories.
    ...dirs.components.map((componentsDir) => join(componentsDir, "*", nestedGlobPattern)) || [],
    // Prefixed components can have one-word names in file
    ...dirs.componentsPrefixed.map((componentsDir) => join(componentsDir, nestedGlobPattern)) || []
  ])].sort();
  const configs = [];
  if (fileRoutes.length) {
    configs.push({
      name: "nuxt/disables/routes",
      files: fileRoutes,
      rules: {
        "vue/multi-word-component-names": "off"
      }
    });
  }
  return configs;
}

function nuxt(options) {
  const resolved = resolveOptions(options);
  const dirs = resolved.dirs;
  const fileSingleRoot = [
    ...dirs.layouts?.map((layoutsDir) => join(layoutsDir, `**/*.${GLOB_EXTS}`)) || [],
    ...dirs.pages?.map((pagesDir) => join(pagesDir, `**/*.${GLOB_EXTS}`)) || [],
    ...dirs.components?.map((componentsDir) => join(componentsDir, `**/*.server.${GLOB_EXTS}`)) || []
  ].sort();
  const {
    sortConfigKeys = !!options.features?.stylistic
  } = options.features?.nuxt || {};
  const configs = [];
  configs.push({
    name: "nuxt/setup",
    plugins: {
      nuxt: nuxtPlugin
    },
    languageOptions: {
      globals: {
        // Nuxt's runtime globals
        $fetch: "readonly"
      }
    }
  });
  if (fileSingleRoot.length)
    configs.push({
      name: "nuxt/vue/single-root",
      files: fileSingleRoot,
      rules: {
        "vue/no-multiple-template-root": "error"
      }
    });
  configs.push({
    name: "nuxt/rules",
    rules: {
      "nuxt/prefer-import-meta": "error"
    }
  });
  if (sortConfigKeys) {
    configs.push({
      name: "nuxt/sort-config",
      files: [
        "**/nuxt.config.?([cm])[jt]s?(x)"
      ],
      rules: {
        "nuxt/nuxt-config-keys-order": "error"
      }
    });
  }
  return configs;
}

function ignores() {
  return [
    {
      ignores: [
        "**/dist",
        "**/node_modules",
        "**/.nuxt",
        "**/.output",
        "**/.vercel",
        "**/.netlify",
        "**/public"
      ]
    }
  ];
}

function javascript() {
  return [
    {
      ...pluginESLint.configs.recommended,
      name: "nuxt/javascript",
      languageOptions: {
        ecmaVersion: 2022,
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: 2022,
          sourceType: "module"
        },
        sourceType: "module",
        globals: {
          ...globals.browser,
          ...globals.es2021,
          ...globals.node,
          document: "readonly",
          navigator: "readonly",
          window: "readonly"
        }
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      }
    }
  ];
}

function defineFlatConfigs(...configs) {
  return composer(...configs);
}
function createConfigForNuxt(options = {}, ...userConfigs) {
  const c = composer();
  const resolved = resolveOptions(options);
  if (resolved.features.standalone !== false) {
    c.append(
      gitignore({ strict: false }),
      ignores(),
      javascript(),
      // Make these imports async, as they are optional and imports plugins
      resolved.features.typescript !== false ? import('../chunks/typescript.mjs').then((m) => m.default(resolved)) : void 0,
      import('../chunks/vue.mjs').then((m) => m.default(resolved)),
      import('../chunks/import.mjs').then((m) => m.default(resolved))
    );
  }
  c.append(
    nuxt(resolved)
  );
  if (resolved.features.tooling) {
    const toolingOptions = typeof resolved.features.tooling === "boolean" ? {} : resolved.features.tooling;
    c.append(
      toolingOptions.jsdoc !== false && import('../chunks/jsdoc.mjs').then((m) => m.default(resolved)),
      toolingOptions.unicorn !== false && import('../chunks/unicorn.mjs').then((m) => m.default()),
      toolingOptions.regexp !== false && import('../chunks/regexp.mjs').then((m) => m.default())
    );
  }
  if (resolved.features.stylistic) {
    const stylisticOptions = typeof resolved.features.stylistic === "boolean" ? {} : resolved.features.stylistic;
    c.append(
      import('../chunks/stylistic.mjs').then((m) => m.default(stylisticOptions))
    );
  }
  c.append(
    disables(resolved)
  );
  if (userConfigs.length > 0) {
    c.append(...userConfigs);
  }
  c.setPluginConflictsError().setPluginConflictsError("import", [
    'Different instances of plugin "{{pluginName}}" found in multiple configs:',
    "{{configNames}}.",
    "You might forget to set `standalone: false`.",
    "Please refer to https://eslint.nuxt.com/packages/module#custom-config-presets.",
    ""
  ].join("\n"));
  return c;
}

export { removeUndefined as a, createConfigForNuxt as c, defineFlatConfigs as d, resolveOptions as r };
