"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNodeResolver = createNodeResolver;
const tslib_1 = require("tslib");
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const node_module_1 = require("node:module");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const enhanced_resolve_1 = require("enhanced-resolve");
function createNodeResolver({ extensions = ['.mjs', '.cjs', '.js', '.json', '.node'], conditionNames = ['default', 'module', 'import', 'require'], mainFields: _mainFields = ['main'], exportsFields: _exportsFields = ['exports'], mainFiles: _mainFiles = ['index'], fileSystem = new enhanced_resolve_1.CachedInputFileSystem(node_fs_1.default, 4 * 1000), ...restOptions } = {}) {
    const resolver = enhanced_resolve_1.ResolverFactory.createResolver({
        extensions,
        fileSystem,
        conditionNames,
        useSyncFileSystemCalls: true,
        ...restOptions,
    });
    return {
        interfaceVersion: 3,
        name: 'eslint-plugin-import-x built-in node resolver',
        resolve: (modulePath, sourceFile) => {
            if ((0, node_module_1.isBuiltin)(modulePath)) {
                return { found: true, path: null };
            }
            if (modulePath.startsWith('data:')) {
                return { found: true, path: null };
            }
            try {
                const resolved = resolver.resolveSync({}, node_path_1.default.dirname(sourceFile), modulePath);
                if (resolved) {
                    return { found: true, path: resolved };
                }
                return { found: false };
            }
            catch {
                return { found: false };
            }
        },
    };
}
//# sourceMappingURL=node-resolver.js.map