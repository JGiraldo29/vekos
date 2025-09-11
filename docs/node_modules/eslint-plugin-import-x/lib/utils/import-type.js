"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAbsolute = isAbsolute;
exports.isBuiltIn = isBuiltIn;
exports.isExternalModule = isExternalModule;
exports.isExternalModuleMain = isExternalModuleMain;
exports.isScoped = isScoped;
exports.isScopedMain = isScopedMain;
exports.importType = importType;
const tslib_1 = require("tslib");
const node_module_1 = require("node:module");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const package_path_1 = require("./package-path");
const resolve_1 = require("./resolve");
function baseModule(name) {
    if (isScoped(name)) {
        const [scope, pkg] = name.split('/');
        return `${scope}/${pkg}`;
    }
    const [pkg] = name.split('/');
    return pkg;
}
function isInternalRegexMatch(name, settings) {
    const internalScope = settings?.['import-x/internal-regex'];
    return internalScope && new RegExp(internalScope).test(name);
}
function isAbsolute(name) {
    return typeof name === 'string' && node_path_1.default.isAbsolute(name);
}
function isBuiltIn(name, settings, modulePath) {
    if (modulePath || !name) {
        return false;
    }
    const base = baseModule(name);
    const extras = (settings && settings['import-x/core-modules']) || [];
    return (0, node_module_1.isBuiltin)(base) || extras.includes(base);
}
function isExternalModule(name, modulePath, context) {
    return ((isModule(name) || isScoped(name)) &&
        typeTest(name, context, modulePath) === 'external');
}
function isExternalModuleMain(name, modulePath, context) {
    if (arguments.length < 3) {
        throw new TypeError('isExternalModule: name, path, and context are all required');
    }
    return (isModuleMain(name) && typeTest(name, context, modulePath) === 'external');
}
const moduleRegExp = /^\w/;
function isModule(name) {
    return !!name && moduleRegExp.test(name);
}
const moduleMainRegExp = /^\w((?!\/).)*$/;
function isModuleMain(name) {
    return !!name && moduleMainRegExp.test(name);
}
const scopedRegExp = /^@[^/]+\/?[^/]+/;
function isScoped(name) {
    return !!name && scopedRegExp.test(name);
}
const scopedMainRegExp = /^@[^/]+\/?[^/]+$/;
function isScopedMain(name) {
    return !!name && scopedMainRegExp.test(name);
}
function isRelativeToParent(name) {
    return /^\.\.$|^\.\.[/\\]/.test(name);
}
const indexFiles = new Set(['.', './', './index', './index.js']);
function isIndex(name) {
    return indexFiles.has(name);
}
function isRelativeToSibling(name) {
    return /^\.[/\\]/.test(name);
}
function isExternalPath(filepath, context) {
    if (!filepath) {
        return false;
    }
    const { settings } = context;
    const packagePath = (0, package_path_1.getContextPackagePath)(context);
    if (node_path_1.default.relative(packagePath, filepath).startsWith('..')) {
        return true;
    }
    const folders = settings?.['import-x/external-module-folders'] || [
        'node_modules',
    ];
    return folders.some(folder => {
        const folderPath = node_path_1.default.resolve(packagePath, folder);
        const relativePath = node_path_1.default.relative(folderPath, filepath);
        return !relativePath.startsWith('..');
    });
}
function isInternalPath(filepath, context) {
    if (!filepath) {
        return false;
    }
    const packagePath = (0, package_path_1.getContextPackagePath)(context);
    return !node_path_1.default.relative(packagePath, filepath).startsWith('../');
}
function isExternalLookingName(name) {
    return isModule(name) || isScoped(name);
}
function typeTest(name, context, path) {
    const { settings } = context;
    if (isInternalRegexMatch(name, settings)) {
        return 'internal';
    }
    if (isAbsolute(name)) {
        return 'absolute';
    }
    if (isBuiltIn(name, settings, path)) {
        return 'builtin';
    }
    if (isRelativeToParent(name)) {
        return 'parent';
    }
    if (isIndex(name)) {
        return 'index';
    }
    if (isRelativeToSibling(name)) {
        return 'sibling';
    }
    if (isExternalPath(path, context)) {
        return 'external';
    }
    if (isInternalPath(path, context)) {
        return 'internal';
    }
    if (isExternalLookingName(name)) {
        return 'external';
    }
    return 'unknown';
}
function importType(name, context) {
    return typeTest(name, context, (0, resolve_1.resolve)(name, context));
}
//# sourceMappingURL=import-type.js.map