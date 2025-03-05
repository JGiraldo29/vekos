import pluginImport from 'eslint-plugin-import-x';
import { r as resolveOptions } from '../shared/eslint-config.b403f998.mjs';
import 'eslint-flat-config-utils';
import 'eslint-config-flat-gitignore';
import 'pathe';
import 'local-pkg';
import '@nuxt/eslint-plugin';
import '@eslint/js';
import 'globals';

function imports(options) {
  const resolved = resolveOptions(options);
  return [
    {
      name: "nuxt/import/rules",
      plugins: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        import: pluginImport
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

export { imports as default };
