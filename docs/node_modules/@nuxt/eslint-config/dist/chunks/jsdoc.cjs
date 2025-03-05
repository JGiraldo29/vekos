'use strict';

const jsdocPlugin = require('eslint-plugin-jsdoc');
const flat = require('../shared/eslint-config.b5211f62.cjs');
require('eslint-flat-config-utils');
require('eslint-config-flat-gitignore');
require('pathe');
require('local-pkg');
require('@nuxt/eslint-plugin');
require('@eslint/js');
require('globals');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const jsdocPlugin__default = /*#__PURE__*/_interopDefaultCompat(jsdocPlugin);

function jsdoc(options = {}) {
  const resolved = flat.resolveOptions(options);
  return [
    {
      name: "nuxt/tooling/jsdoc",
      plugins: {
        jsdoc: jsdocPlugin__default
      },
      rules: {
        "jsdoc/check-access": "warn",
        "jsdoc/check-param-names": "warn",
        "jsdoc/check-property-names": "warn",
        "jsdoc/check-types": "warn",
        "jsdoc/empty-tags": "warn",
        "jsdoc/implements-on-classes": "warn",
        "jsdoc/no-defaults": "warn",
        "jsdoc/no-multi-asterisks": "warn",
        "jsdoc/require-param-name": "warn",
        "jsdoc/require-property": "warn",
        "jsdoc/require-property-description": "warn",
        "jsdoc/require-property-name": "warn",
        "jsdoc/require-returns-check": "warn",
        "jsdoc/require-returns-description": "warn",
        "jsdoc/require-yields-check": "warn",
        ...resolved.features.stylistic ? {
          "jsdoc/check-alignment": "warn",
          "jsdoc/multiline-blocks": "warn"
        } : {}
      }
    }
  ];
}

exports.default = jsdoc;
