'use strict';

const parserVue = require('vue-eslint-parser');
const pluginVue = require('eslint-plugin-vue');
const flat = require('../shared/eslint-config.b5211f62.cjs');
require('eslint-flat-config-utils');
require('eslint-config-flat-gitignore');
require('pathe');
require('local-pkg');
require('@nuxt/eslint-plugin');
require('@eslint/js');
require('globals');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

function _interopNamespaceCompat(e) {
  if (e && typeof e === 'object' && 'default' in e) return e;
  const n = Object.create(null);
  if (e) {
    for (const k in e) {
      n[k] = e[k];
    }
  }
  n.default = e;
  return n;
}

const parserVue__namespace = /*#__PURE__*/_interopNamespaceCompat(parserVue);
const pluginVue__default = /*#__PURE__*/_interopDefaultCompat(pluginVue);

const INLINE_ELEMENTS = ["a", "abbr", "audio", "b", "bdi", "bdo", "canvas", "cite", "code", "data", "del", "dfn", "em", "i", "iframe", "ins", "kbd", "label", "map", "mark", "noscript", "object", "output", "picture", "q", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "svg", "time", "u", "var", "video"];
async function vue(options) {
  const resolved = flat.resolveOptions(options);
  const hasTs = resolved.features.typescript !== false;
  const parser = hasTs ? await import('./typescript.cjs').then((mod) => mod.parserTs) : void 0;
  const {
    indent = 2,
    commaDangle = "always-multiline"
  } = typeof resolved.features.stylistic === "boolean" ? {} : resolved.features.stylistic;
  return [
    {
      name: "nuxt/vue/setup",
      plugins: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vue: pluginVue__default
      },
      languageOptions: {
        parserOptions: {
          ecmaVersion: "latest",
          extraFileExtensions: [".vue"],
          parser,
          sourceType: "module",
          ecmaFeatures: {
            jsx: true
          }
        },
        // This allows Vue plugin to work with auto imports
        // https://github.com/vuejs/eslint-plugin-vue/pull/2422
        globals: {
          computed: "readonly",
          defineEmits: "readonly",
          defineExpose: "readonly",
          defineProps: "readonly",
          onMounted: "readonly",
          onUnmounted: "readonly",
          reactive: "readonly",
          ref: "readonly",
          shallowReactive: "readonly",
          shallowRef: "readonly",
          toRef: "readonly",
          toRefs: "readonly",
          watch: "readonly",
          watchEffect: "readonly"
        }
      }
    },
    {
      name: "nuxt/vue/rules",
      files: [
        "**/*.vue"
      ],
      languageOptions: {
        parser: parserVue__namespace
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processor: pluginVue__default.processors[".vue"],
      rules: flat.removeUndefined({
        ...pluginVue__default.configs.base.rules,
        ...pluginVue__default.configs["vue3-essential"].rules,
        ...pluginVue__default.configs["vue3-strongly-recommended"].rules,
        ...pluginVue__default.configs["vue3-recommended"].rules,
        // Deprecated in favor of 'vue/block-order'
        "vue/component-tags-order": void 0,
        "vue/block-order": "warn",
        ...resolved.features.stylistic ? {
          "vue/array-bracket-spacing": ["error", "never"],
          "vue/arrow-spacing": ["error", { after: true, before: true }],
          "vue/block-spacing": ["error", "always"],
          "vue/block-tag-newline": [
            "error",
            {
              multiline: "always",
              singleline: "always"
            }
          ],
          "vue/brace-style": ["error", "stroustrup", { allowSingleLine: true }],
          "vue/html-indent": ["error", indent],
          "vue/html-quotes": ["error", "double"],
          "vue/comma-dangle": ["error", commaDangle],
          "vue/comma-spacing": ["error", { after: true, before: false }],
          "vue/comma-style": ["error", "last"],
          "vue/html-comment-content-spacing": [
            "error",
            "always",
            { exceptions: ["-"] }
          ],
          "vue/key-spacing": ["error", { afterColon: true, beforeColon: false }],
          "vue/keyword-spacing": ["error", { after: true, before: true }],
          "vue/object-curly-newline": "off",
          "vue/object-curly-spacing": ["error", "always"],
          "vue/object-property-newline": [
            "error",
            { allowMultiplePropertiesPerLine: true }
          ],
          "vue/one-component-per-file": "off",
          "vue/operator-linebreak": ["error", "before"],
          "vue/padding-line-between-blocks": ["error", "always"],
          "vue/quote-props": ["error", "consistent-as-needed"],
          "vue/require-default-prop": "off",
          "vue/space-in-parens": ["error", "never"],
          "vue/template-curly-spacing": "error",
          "vue/multiline-html-element-content-newline": ["error", {
            ignoreWhenEmpty: true,
            ignores: ["pre", "textarea", "router-link", "RouterLink", "nuxt-link", "NuxtLink", "u-link", "ULink", ...INLINE_ELEMENTS],
            allowEmptyLines: false
          }]
        } : {
          // Disable Vue's default stylistic rules when stylistic is not enabled
          "vue/html-closing-bracket-newline": void 0,
          "vue/html-closing-bracket-spacing": void 0,
          "vue/html-indent": void 0,
          "vue/html-quotes": void 0,
          "vue/max-attributes-per-line": void 0,
          "vue/multiline-html-element-content-newline": void 0,
          "vue/mustache-interpolation-spacing": void 0,
          "vue/no-multi-spaces": void 0,
          "vue/no-spaces-around-equal-signs-in-attribute": void 0,
          "vue/singleline-html-element-content-newline": void 0
        }
      })
    }
  ];
}

exports.default = vue;
