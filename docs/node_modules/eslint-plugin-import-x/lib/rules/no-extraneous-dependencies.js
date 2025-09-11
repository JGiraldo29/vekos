"use strict";
const tslib_1 = require("tslib");
const node_fs_1 = tslib_1.__importDefault(require("node:fs"));
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const minimatch_1 = require("minimatch");
const utils_1 = require("../utils");
const depFieldCache = new Map();
function hasKeys(obj = {}) {
    return Object.keys(obj).length > 0;
}
function arrayOrKeys(arrayOrObject) {
    return Array.isArray(arrayOrObject)
        ? arrayOrObject
        : Object.keys(arrayOrObject);
}
function readJSON(jsonPath, throwException) {
    try {
        return JSON.parse(node_fs_1.default.readFileSync(jsonPath, 'utf8'));
    }
    catch (error) {
        if (throwException) {
            throw error;
        }
    }
}
function extractDepFields(pkg) {
    return {
        dependencies: pkg.dependencies || {},
        devDependencies: pkg.devDependencies || {},
        optionalDependencies: pkg.optionalDependencies || {},
        peerDependencies: pkg.peerDependencies || {},
        bundledDependencies: arrayOrKeys(pkg.bundleDependencies || pkg.bundledDependencies || []),
    };
}
function getPackageDepFields(packageJsonPath, throwAtRead) {
    if (!depFieldCache.has(packageJsonPath)) {
        const packageJson = readJSON(packageJsonPath, throwAtRead);
        if (packageJson) {
            const depFields = extractDepFields(packageJson);
            depFieldCache.set(packageJsonPath, depFields);
        }
    }
    return depFieldCache.get(packageJsonPath);
}
function getDependencies(context, packageDir) {
    let paths = [];
    try {
        let packageContent = {
            dependencies: {},
            devDependencies: {},
            optionalDependencies: {},
            peerDependencies: {},
            bundledDependencies: [],
        };
        if (packageDir && packageDir.length > 0) {
            paths = Array.isArray(packageDir)
                ? packageDir.map(dir => node_path_1.default.resolve(dir))
                : [node_path_1.default.resolve(packageDir)];
        }
        if (paths.length > 0) {
            for (const dir of paths) {
                const packageJsonPath = node_path_1.default.resolve(dir, 'package.json');
                const packageContent_ = getPackageDepFields(packageJsonPath, paths.length === 1);
                if (packageContent_) {
                    for (const depsKey of Object.keys(packageContent)) {
                        const key = depsKey;
                        Object.assign(packageContent[key], packageContent_[key]);
                    }
                }
            }
        }
        else {
            const packageJsonPath = (0, utils_1.pkgUp)({
                cwd: context.physicalFilename,
            });
            const packageContent_ = getPackageDepFields(packageJsonPath, false);
            if (packageContent_) {
                packageContent = packageContent_;
            }
        }
        if (![
            packageContent.dependencies,
            packageContent.devDependencies,
            packageContent.optionalDependencies,
            packageContent.peerDependencies,
            packageContent.bundledDependencies,
        ].some(hasKeys)) {
            return;
        }
        return packageContent;
    }
    catch (error_) {
        const error = error_;
        if (paths.length > 0 && error.code === 'ENOENT') {
            context.report({
                messageId: 'pkgNotFound',
                loc: { line: 0, column: 0 },
            });
        }
        if (error.name === 'JSONError' || error instanceof SyntaxError) {
            context.report({
                messageId: 'pkgUnparsable',
                data: { error: error.message },
                loc: { line: 0, column: 0 },
            });
        }
    }
}
function getModuleOriginalName(name) {
    const [first, second] = name.split('/');
    return first.startsWith('@') ? `${first}/${second}` : first;
}
function checkDependencyDeclaration(deps, packageName, declarationStatus) {
    const newDeclarationStatus = declarationStatus || {
        isInDeps: false,
        isInDevDeps: false,
        isInOptDeps: false,
        isInPeerDeps: false,
        isInBundledDeps: false,
    };
    const packageHierarchy = [];
    const packageNameParts = packageName ? packageName.split('/') : [];
    for (const [index, namePart] of packageNameParts.entries()) {
        if (!namePart.startsWith('@')) {
            const ancestor = packageNameParts.slice(0, index + 1).join('/');
            packageHierarchy.push(ancestor);
        }
    }
    return packageHierarchy.reduce((result, ancestorName) => ({
        isInDeps: result.isInDeps || deps.dependencies[ancestorName] !== undefined,
        isInDevDeps: result.isInDevDeps || deps.devDependencies[ancestorName] !== undefined,
        isInOptDeps: result.isInOptDeps ||
            deps.optionalDependencies[ancestorName] !== undefined,
        isInPeerDeps: result.isInPeerDeps ||
            deps.peerDependencies[ancestorName] !== undefined,
        isInBundledDeps: result.isInBundledDeps ||
            deps.bundledDependencies.includes(ancestorName),
    }), newDeclarationStatus);
}
function reportIfMissing(context, deps, depsOptions, node, name, whitelist) {
    if (!depsOptions.verifyTypeImports &&
        (('importKind' in node &&
            (node.importKind === 'type' ||
                node.importKind === 'typeof')) ||
            ('exportKind' in node && node.exportKind === 'type') ||
            ('specifiers' in node &&
                Array.isArray(node.specifiers) &&
                node.specifiers.length > 0 &&
                node.specifiers.every(specifier => 'importKind' in specifier &&
                    (specifier.importKind === 'type' ||
                        specifier.importKind === 'typeof'))))) {
        return;
    }
    const typeOfImport = (0, utils_1.importType)(name, context);
    if (typeOfImport !== 'external' &&
        (typeOfImport !== 'internal' || !depsOptions.verifyInternalDeps)) {
        return;
    }
    const resolved = (0, utils_1.resolve)(name, context);
    if (!resolved) {
        return;
    }
    const importPackageName = getModuleOriginalName(name);
    let declarationStatus = checkDependencyDeclaration(deps, importPackageName);
    if (declarationStatus.isInDeps ||
        (depsOptions.allowDevDeps && declarationStatus.isInDevDeps) ||
        (depsOptions.allowPeerDeps && declarationStatus.isInPeerDeps) ||
        (depsOptions.allowOptDeps && declarationStatus.isInOptDeps) ||
        (depsOptions.allowBundledDeps && declarationStatus.isInBundledDeps)) {
        return;
    }
    const realPackageName = (0, utils_1.getFilePackageName)(resolved);
    if (realPackageName && realPackageName !== importPackageName) {
        declarationStatus = checkDependencyDeclaration(deps, realPackageName, declarationStatus);
        if (declarationStatus.isInDeps ||
            (depsOptions.allowDevDeps && declarationStatus.isInDevDeps) ||
            (depsOptions.allowPeerDeps && declarationStatus.isInPeerDeps) ||
            (depsOptions.allowOptDeps && declarationStatus.isInOptDeps) ||
            (depsOptions.allowBundledDeps && declarationStatus.isInBundledDeps)) {
            return;
        }
    }
    const packageName = realPackageName || importPackageName;
    if (whitelist?.has(packageName)) {
        return;
    }
    if (declarationStatus.isInDevDeps && !depsOptions.allowDevDeps) {
        context.report({
            node,
            messageId: 'devDep',
            data: {
                packageName,
            },
        });
        return;
    }
    if (declarationStatus.isInOptDeps && !depsOptions.allowOptDeps) {
        context.report({
            node,
            messageId: 'optDep',
            data: {
                packageName,
            },
        });
        return;
    }
    context.report({
        node,
        messageId: 'missing',
        data: {
            packageName,
        },
    });
}
function testConfig(config, filename) {
    if (typeof config === 'boolean' || config === undefined) {
        return config;
    }
    return config.some(c => (0, minimatch_1.minimatch)(filename, c) || (0, minimatch_1.minimatch)(filename, node_path_1.default.resolve(c)));
}
module.exports = (0, utils_1.createRule)({
    name: 'no-extraneous-dependencies',
    meta: {
        type: 'problem',
        docs: {
            category: 'Helpful warnings',
            description: 'Forbid the use of extraneous packages.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    devDependencies: { type: ['boolean', 'array'] },
                    optionalDependencies: { type: ['boolean', 'array'] },
                    peerDependencies: { type: ['boolean', 'array'] },
                    bundledDependencies: { type: ['boolean', 'array'] },
                    packageDir: { type: ['string', 'array'] },
                    includeInternal: { type: ['boolean'] },
                    includeTypes: { type: ['boolean'] },
                    whitelist: { type: ['array'] },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            pkgNotFound: 'The package.json file could not be found.',
            pkgUnparsable: 'The package.json file could not be parsed: {{error}}',
            devDep: "'{{packageName}}' should be listed in the project's dependencies, not devDependencies.",
            optDep: "'{{packageName}}' should be listed in the project's dependencies, not optionalDependencies.",
            missing: "'{{packageName}}' should be listed in the project's dependencies. Run 'npm i -S {{packageName}}' to add it",
        },
    },
    defaultOptions: [],
    create(context) {
        const options = context.options[0] || {};
        const filename = context.physicalFilename;
        const deps = getDependencies(context, options.packageDir) || extractDepFields({});
        const depsOptions = {
            allowDevDeps: testConfig(options.devDependencies, filename) !== false,
            allowOptDeps: testConfig(options.optionalDependencies, filename) !== false,
            allowPeerDeps: testConfig(options.peerDependencies, filename) !== false,
            allowBundledDeps: testConfig(options.bundledDependencies, filename) !== false,
            verifyInternalDeps: !!options.includeInternal,
            verifyTypeImports: !!options.includeTypes,
        };
        return {
            ...(0, utils_1.moduleVisitor)((source, node) => {
                reportIfMissing(context, deps, depsOptions, node, source.value, options.whitelist ? new Set(options.whitelist) : undefined);
            }, { commonjs: true }),
            'Program:exit'() {
                depFieldCache.clear();
            },
        };
    },
});
//# sourceMappingURL=no-extraneous-dependencies.js.map