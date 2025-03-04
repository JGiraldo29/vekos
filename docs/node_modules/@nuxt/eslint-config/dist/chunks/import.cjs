'use strict';

const pluginImport = require('eslint-plugin-import-x');
const flat = require('../shared/eslint-config.b5211f62.cjs');
require('eslint-flat-config-utils');
require('eslint-config-flat-gitignore');
require('pathe');
require('local-pkg');
require('@nuxt/eslint-plugin');
require('@eslint/js');
require('globals');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e.default : e; }

const pluginImport__default = /*#__PURE__*/_interopDefaultCompat(pluginImport);

function imports(options) {
  const resolved = flat.resolveOptions(options);
  return [
    {
      name: "nuxt/import/rules",
      plugins: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import: pluginImport__default
      },
      rules: {
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",
        ...resolved.features.stylistic ? {
          "import/order": "error",
          "import/newline-after-import": ["error", { count: 1 }]
        } : {}
      }
    }
  ];
}

exports.default = imports;
