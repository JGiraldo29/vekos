"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExistsCache = exports.IMPORT_RESOLVE_ERROR_NAME = exports.CASE_SENSITIVE_FS = void 0;
exports.fileExistsWithCaseSync = fileExistsWithCaseSync;
exports.relative = relative;
exports.resolve = resolve;
exports.importXResolverCompat = importXResolverCompat;
const tslib_1 = require("tslib");
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const stable_hash_1 = tslib_1.__importDefault(require("stable-hash"));
const legacy_resolver_settings_1 = require("./legacy-resolver-settings");
const module_cache_1 = require("./module-cache");
exports.CASE_SENSITIVE_FS = !node_fs_1.default.existsSync(node_path_1.default.resolve(__dirname, node_path_1.default.basename(__filename).replace(/^resolve\./, 'reSOLVE.')));
exports.IMPORT_RESOLVE_ERROR_NAME = 'EslintPluginImportResolveError';
exports.fileExistsCache = new module_cache_1.ModuleCache();
function fileExistsWithCaseSync(filepath, cacheSettings, strict) {
    if (exports.CASE_SENSITIVE_FS) {
        return true;
    }
    if (filepath === null) {
        return true;
    }
    if (filepath.toLowerCase() === process.cwd().toLowerCase() && !strict) {
        return true;
    }
    const parsedPath = node_path_1.default.parse(filepath);
    const dir = parsedPath.dir;
    let result = exports.fileExistsCache.get(filepath, cacheSettings);
    if (result != null) {
        return result;
    }
    if (dir === '' || parsedPath.root === filepath) {
        result = true;
    }
    else {
        const filenames = node_fs_1.default.readdirSync(dir);
        result = filenames.includes(parsedPath.base)
            ? fileExistsWithCaseSync(dir, cacheSettings, strict)
            : false;
    }
    exports.fileExistsCache.set(filepath, result);
    return result;
}
let prevSettings = null;
let memoizedHash;
function isNamedResolver(resolver) {
    return !!(typeof resolver === 'object' &&
        resolver &&
        'name' in resolver &&
        typeof resolver.name === 'string' &&
        resolver.name);
}
function isValidNewResolver(resolver) {
    if (typeof resolver !== 'object' || resolver == null) {
        return false;
    }
    if (!('resolve' in resolver) || !('interfaceVersion' in resolver)) {
        return false;
    }
    if (typeof resolver.interfaceVersion !== 'number' ||
        resolver.interfaceVersion !== 3) {
        return false;
    }
    if (typeof resolver.resolve !== 'function') {
        return false;
    }
    return true;
}
function fullResolve(modulePath, sourceFile, settings) {
    const coreSet = new Set(settings['import-x/core-modules']);
    if (coreSet.has(modulePath)) {
        return {
            found: true,
            path: null,
        };
    }
    const sourceDir = node_path_1.default.dirname(sourceFile);
    if (prevSettings !== settings) {
        memoizedHash = (0, stable_hash_1.default)(settings);
        prevSettings = settings;
    }
    const cacheKey = sourceDir + memoizedHash + modulePath;
    const cacheSettings = module_cache_1.ModuleCache.getSettings(settings);
    const cachedPath = exports.fileExistsCache.get(cacheKey, cacheSettings);
    if (cachedPath !== undefined) {
        return { found: true, path: cachedPath };
    }
    if (Object.prototype.hasOwnProperty.call(settings, 'import-x/resolver-next') &&
        settings['import-x/resolver-next']) {
        const configResolvers = settings['import-x/resolver-next'];
        for (let i = 0, len = configResolvers.length; i < len; i++) {
            const resolver = configResolvers[i];
            const resolverName = isNamedResolver(resolver)
                ? resolver.name
                : `settings['import-x/resolver-next'][${i}]`;
            if (!isValidNewResolver(resolver)) {
                const err = new TypeError(`${resolverName} is not a valid import resolver for eslint-plugin-import-x!`);
                err.name = exports.IMPORT_RESOLVE_ERROR_NAME;
                throw err;
            }
            const resolved = resolver.resolve(modulePath, sourceFile);
            if (!resolved.found) {
                continue;
            }
            exports.fileExistsCache.set(cacheKey, resolved.path);
            return resolved;
        }
    }
    else {
        const configResolvers = settings['import-x/resolver-legacy'] ||
            settings['import-x/resolver'] || {
            node: settings['import-x/resolve'],
        };
        for (const { enable, options, resolver } of (0, legacy_resolver_settings_1.normalizeConfigResolvers)(configResolvers, sourceFile)) {
            if (!enable) {
                continue;
            }
            const resolved = (0, legacy_resolver_settings_1.resolveWithLegacyResolver)(resolver, options, modulePath, sourceFile);
            if (!resolved.found) {
                continue;
            }
            exports.fileExistsCache.set(cacheKey, resolved.path);
            return resolved;
        }
    }
    return { found: false };
}
function relative(modulePath, sourceFile, settings) {
    return fullResolve(modulePath, sourceFile, settings).path;
}
const erroredContexts = new Set();
function resolve(p, context) {
    try {
        return relative(p, context.physicalFilename, context.settings);
    }
    catch (error_) {
        const error = error_;
        if (!erroredContexts.has(context)) {
            let errMessage = error.message;
            if (error.name !== exports.IMPORT_RESOLVE_ERROR_NAME && error.stack) {
                errMessage = error.stack.replace(/^Error: /, '');
            }
            context.report({
                message: `Resolve error: ${errMessage}`,
                loc: {
                    line: 1,
                    column: 0,
                },
            });
            erroredContexts.add(context);
        }
    }
}
function importXResolverCompat(resolver, resolverOptions = {}) {
    if (isValidNewResolver(resolver)) {
        return resolver;
    }
    return {
        interfaceVersion: 3,
        resolve: (modulePath, sourceFile) => {
            const resolved = (0, legacy_resolver_settings_1.resolveWithLegacyResolver)(resolver, resolverOptions, modulePath, sourceFile);
            return resolved;
        },
    };
}
//# sourceMappingURL=resolve.js.map