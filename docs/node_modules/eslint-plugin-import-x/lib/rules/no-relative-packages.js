"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const utils_1 = require("../utils");
function toPosixPath(filePath) {
    return filePath.replaceAll('\\', '/');
}
function findNamedPackage(filePath) {
    const found = (0, utils_1.readPkgUp)({ cwd: filePath });
    if (found.pkg && !found.pkg.name) {
        return findNamedPackage(node_path_1.default.resolve(found.path, '../..'));
    }
    return found;
}
const potentialViolationTypes = new Set(['parent', 'index', 'sibling']);
function checkImportForRelativePackage(context, importPath, node) {
    if (!potentialViolationTypes.has((0, utils_1.importType)(importPath, context))) {
        return;
    }
    const resolvedImport = (0, utils_1.resolve)(importPath, context);
    const resolvedContext = context.physicalFilename;
    if (!resolvedImport || !resolvedContext) {
        return;
    }
    const importPkg = findNamedPackage(resolvedImport);
    const contextPkg = findNamedPackage(resolvedContext);
    if (importPkg.pkg &&
        contextPkg.pkg &&
        importPkg.pkg.name !== contextPkg.pkg.name) {
        const importBaseName = node_path_1.default.basename(importPath);
        const importRoot = node_path_1.default.dirname(importPkg.path);
        const properPath = node_path_1.default.relative(importRoot, resolvedImport);
        const properImport = node_path_1.default.join(importPkg.pkg.name, node_path_1.default.dirname(properPath), importBaseName === node_path_1.default.basename(importRoot) ? '' : importBaseName);
        context.report({
            node,
            messageId: 'noAllowed',
            data: {
                properImport,
                importPath,
            },
            fix: fixer => fixer.replaceText(node, JSON.stringify(toPosixPath(properImport))),
        });
    }
}
module.exports = (0, utils_1.createRule)({
    name: 'no-relative-packages',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Static analysis',
            description: 'Forbid importing packages through relative paths.',
        },
        fixable: 'code',
        schema: [(0, utils_1.makeOptionsSchema)()],
        messages: {
            noAllowed: 'Relative import from another package is not allowed. Use `{{properImport}}` instead of `{{importPath}}`',
        },
    },
    defaultOptions: [],
    create(context) {
        return (0, utils_1.moduleVisitor)(source => checkImportForRelativePackage(context, source.value, source), context.options[0]);
    },
});
//# sourceMappingURL=no-relative-packages.js.map