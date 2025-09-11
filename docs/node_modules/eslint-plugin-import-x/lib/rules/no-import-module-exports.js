"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const minimatch_1 = require("minimatch");
const utils_1 = require("../utils");
function getEntryPoint(context) {
    const pkgPath = (0, utils_1.pkgUp)({
        cwd: context.physicalFilename,
    });
    try {
        return require.resolve(node_path_1.default.dirname(pkgPath));
    }
    catch {
        return null;
    }
}
function findScope(context, identifier) {
    const { scopeManager } = context.sourceCode;
    return scopeManager?.scopes
        .slice()
        .reverse()
        .find(scope => scope.variables.some(variable => variable.identifiers.some(node => node.name === identifier)));
}
function findDefinition(objectScope, identifier) {
    const variable = objectScope.variables.find(variable => variable.name === identifier);
    return variable.defs.find(def => 'name' in def.name && def.name.name === identifier);
}
module.exports = (0, utils_1.createRule)({
    name: 'no-import-module-exports',
    meta: {
        type: 'problem',
        docs: {
            category: 'Module systems',
            description: 'Forbid import statements with CommonJS module.exports.',
            recommended: true,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    exceptions: { type: 'array' },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            notAllowed: "Cannot use import declarations in modules that export using CommonJS (module.exports = 'foo' or exports.bar = 'hi')",
        },
    },
    defaultOptions: [],
    create(context) {
        const importDeclarations = [];
        const entryPoint = getEntryPoint(context);
        const options = context.options[0] || {};
        let alreadyReported = false;
        return {
            ImportDeclaration(node) {
                importDeclarations.push(node);
            },
            MemberExpression(node) {
                if (alreadyReported) {
                    return;
                }
                const filename = context.physicalFilename;
                const isEntryPoint = entryPoint === filename;
                const isIdentifier = node.object.type === 'Identifier';
                if (!('name' in node.object)) {
                    return;
                }
                const hasKeywords = /^(module|exports)$/.test(node.object.name);
                const objectScope = hasKeywords
                    ? findScope(context, node.object.name)
                    : undefined;
                const variableDefinition = objectScope && findDefinition(objectScope, node.object.name);
                const isImportBinding = variableDefinition?.type === 'ImportBinding';
                const hasCJSExportReference = hasKeywords && (!objectScope || objectScope.type === 'module');
                const isException = !!options.exceptions?.some(glob => (0, minimatch_1.minimatch)(filename, glob));
                if (isIdentifier &&
                    hasCJSExportReference &&
                    !isEntryPoint &&
                    !isException &&
                    !isImportBinding) {
                    for (const importDeclaration of importDeclarations) {
                        context.report({
                            node: importDeclaration,
                            messageId: 'notAllowed',
                        });
                    }
                    alreadyReported = true;
                }
            },
        };
    },
});
//# sourceMappingURL=no-import-module-exports.js.map