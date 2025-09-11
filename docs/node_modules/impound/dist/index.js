import { createFilter } from '@rollup/pluginutils';
import { resolvePath } from 'mlly';
import { join, isAbsolute, relative } from 'pathe';
import { createUnplugin } from 'unplugin';

const RELATIVE_IMPORT_RE = /^\.\.?\//;
const ImpoundPlugin = createUnplugin((options) => {
  const filter = createFilter(options.include, options.exclude, { resolve: options.cwd });
  const proxy = resolvePath("unenv/runtime/mock/proxy", { url: import.meta.url });
  return {
    name: "impound",
    enforce: "pre",
    resolveId(id, importer) {
      if (!importer || !filter(importer)) {
        return;
      }
      if (RELATIVE_IMPORT_RE.test(id)) {
        id = join(importer, "..", id);
      }
      if (isAbsolute(id) && options.cwd) {
        id = relative(options.cwd, id);
      }
      let matched = false;
      const logError = options.error === false ? console.error : this.error.bind(this);
      for (const [pattern, warning] of options.patterns) {
        const usesImport = pattern instanceof RegExp ? pattern.test(id) : pattern === id;
        if (usesImport) {
          const relativeImporter = isAbsolute(importer) && options.cwd ? relative(options.cwd, importer) : importer;
          logError(`${warning || "Invalid import"} [importing \`${id}\` from \`${relativeImporter}\`]`);
          matched = true;
        }
      }
      return matched ? proxy : null;
    }
  };
});

export { ImpoundPlugin };
