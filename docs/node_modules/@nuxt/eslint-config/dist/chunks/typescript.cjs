'use strict';

const parserTs = require('@typescript-eslint/parser');
const pluginTs = require('@typescript-eslint/eslint-plugin');
const flat = require('../shared/eslint-config.b5211f62.cjs');
require('eslint-flat-config-utils');
require('eslint-config-flat-gitignore');
require('pathe');
require('local-pkg');
require('@nuxt/eslint-plugin');
require('@eslint/js');
require('globals');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const parserTs__default = /*#__PURE__*/_interopDefaultCompat(parserTs);
const pluginTs__default = /*#__PURE__*/_interopDefaultCompat(pluginTs);

function typescript(options) {
  const resolved = flat.resolveOptions(options);
  if (resolved.features.typescript === false) {
    return [];
  }
  const tsOptions = resolved.features.typescript === true ? {} : resolved.features.typescript;
  return [
    {
      name: "nuxt/typescript/setup",
      plugins: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "@typescript-eslint": pluginTs__default
      }
    },
    {
      name: "nuxt/typescript/rules",
      files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts", "**/*.vue"],
      languageOptions: {
        parser: parserTs__default
      },
      rules: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...pluginTs__default.configs["eslint-recommended"].overrides[0].rules,
        ...pluginTs__default.configs.recommended.rules,
        ...tsOptions.strict === false ? {} : pluginTs__default.configs.strict.rules,
        // Include typescript eslint rules in *.vue files
        // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts
        "constructor-super": "off",
        // ts(2335) & ts(2377)
        "getter-return": "off",
        // ts(2378)
        "no-const-assign": "off",
        // ts(2588)
        "no-dupe-args": "off",
        // ts(2300)
        "no-dupe-class-members": "off",
        // ts(2393) & ts(2300)
        "no-dupe-keys": "off",
        // ts(1117)
        "no-func-assign": "off",
        // ts(2539)
        "no-import-assign": "off",
        // ts(2539) & ts(2540)
        "no-new-symbol": "off",
        // ts(7009)
        "no-obj-calls": "off",
        // ts(2349)
        "no-redeclare": "off",
        // ts(2451)
        "no-setter-return": "off",
        // ts(2408)
        "no-this-before-super": "off",
        // ts(2376)
        "no-undef": "off",
        // ts(2304)
        "no-unreachable": "off",
        // ts(7027)
        "no-unsafe-negation": "off",
        // ts(2365) & ts(2360) & ts(2358)
        "no-var": "error",
        // ts transpiles let/const to var, so no need for vars any more
        "prefer-const": "error",
        // ts provides better types with const
        "prefer-rest-params": "error",
        // ts provides better types with rest args over arguments
        "prefer-spread": "error",
        // ts transpiles spread to apply, so no need for manual apply
        "valid-typeof": "off",
        // ts(2367)
        "no-unused-vars": "off",
        // ts takes care of this
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/consistent-type-imports": ["error", {
          disallowTypeAnnotations: false,
          prefer: "type-imports"
        }],
        "@typescript-eslint/no-unused-vars": ["error", {
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          vars: "all",
          varsIgnorePattern: "^_"
        }],
        "@typescript-eslint/no-import-type-side-effects": "error"
      }
    }
  ];
}

exports.parserTs = parserTs__default;
exports.pluginTs = pluginTs__default;
exports.default = typescript;
