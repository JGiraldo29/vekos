"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveWithLegacyResolver = resolveWithLegacyResolver;
exports.normalizeConfigResolvers = normalizeConfigResolvers;
const tslib_1 = require("tslib");
const node_module_1 = require("node:module");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const pkg_dir_1 = require("./pkg-dir");
const resolve_1 = require("./resolve");
function resolveWithLegacyResolver(resolver, config, modulePath, sourceFile) {
    if (resolver.interfaceVersion === 2) {
        return resolver.resolve(modulePath, sourceFile, config);
    }
    try {
        const resolved = resolver.resolveImport(modulePath, sourceFile, config);
        if (resolved === undefined) {
            return {
                found: false,
            };
        }
        return {
            found: true,
            path: resolved,
        };
    }
    catch {
        return {
            found: false,
        };
    }
}
function normalizeConfigResolvers(resolvers, sourceFile) {
    const resolverArray = Array.isArray(resolvers) ? resolvers : [resolvers];
    const map = new Map();
    for (const nameOrRecordOrObject of resolverArray) {
        if (typeof nameOrRecordOrObject === 'string') {
            const name = nameOrRecordOrObject;
            map.set(name, {
                name,
                enable: true,
                options: undefined,
                resolver: requireResolver(name, sourceFile),
            });
        }
        else if (typeof nameOrRecordOrObject === 'object') {
            if (nameOrRecordOrObject.name && nameOrRecordOrObject.resolver) {
                const object = nameOrRecordOrObject;
                const { name, enable = true, options, resolver } = object;
                map.set(name, { name, enable, options, resolver });
            }
            else {
                const record = nameOrRecordOrObject;
                for (const [name, enableOrOptions] of Object.entries(record)) {
                    if (typeof enableOrOptions === 'boolean') {
                        map.set(name, {
                            name,
                            enable: enableOrOptions,
                            options: undefined,
                            resolver: requireResolver(name, sourceFile),
                        });
                    }
                    else {
                        map.set(name, {
                            name,
                            enable: true,
                            options: enableOrOptions,
                            resolver: requireResolver(name, sourceFile),
                        });
                    }
                }
            }
        }
        else {
            const err = new Error('invalid resolver config');
            err.name = resolve_1.IMPORT_RESOLVE_ERROR_NAME;
            throw err;
        }
    }
    return [...map.values()];
}
function requireResolver(name, sourceFile) {
    const resolver = tryRequire(`eslint-import-resolver-${name}`, sourceFile) ||
        tryRequire(name, sourceFile) ||
        tryRequire(node_path_1.default.resolve(getBaseDir(sourceFile), name));
    if (!resolver) {
        const err = new Error(`unable to load resolver "${name}".`);
        err.name = resolve_1.IMPORT_RESOLVE_ERROR_NAME;
        throw err;
    }
    if (!isLegacyResolverValid(resolver)) {
        const err = new Error(`${name} with invalid interface loaded as resolver`);
        err.name = resolve_1.IMPORT_RESOLVE_ERROR_NAME;
        throw err;
    }
    return resolver;
}
function isLegacyResolverValid(resolver) {
    if ('interfaceVersion' in resolver && resolver.interfaceVersion === 2) {
        return ('resolve' in resolver &&
            !!resolver.resolve &&
            typeof resolver.resolve === 'function');
    }
    return ('resolveImport' in resolver &&
        !!resolver.resolveImport &&
        typeof resolver.resolveImport === 'function');
}
function tryRequire(target, sourceFile) {
    let resolved;
    try {
        if (sourceFile == null) {
            resolved = require.resolve(target);
        }
        else {
            try {
                resolved = (0, node_module_1.createRequire)(node_path_1.default.resolve(sourceFile)).resolve(target);
            }
            catch {
                resolved = require.resolve(target);
            }
        }
    }
    catch {
        return undefined;
    }
    return require(resolved);
}
function getBaseDir(sourceFile) {
    return (0, pkg_dir_1.pkgDir)(sourceFile) || process.cwd();
}
//# sourceMappingURL=legacy-resolver-settings.js.map