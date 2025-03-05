"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const minimatch_1 = require("minimatch");
const utils_1 = require("../utils");
function testIsAllow(globs, filename, source) {
    if (!Array.isArray(globs)) {
        return false;
    }
    const filePath = source[0] !== '.' && source[0] !== '/'
        ? source
        : node_path_1.default.resolve(node_path_1.default.dirname(filename), source);
    return globs.some(glob => (0, minimatch_1.minimatch)(filePath, glob) || (0, minimatch_1.minimatch)(filePath, node_path_1.default.resolve(glob)));
}
module.exports = (0, utils_1.createRule)({
    name: 'no-unassigned-import',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Style guide',
            description: 'Forbid unassigned imports.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    devDependencies: { type: ['boolean', 'array'] },
                    optionalDependencies: { type: ['boolean', 'array'] },
                    peerDependencies: { type: ['boolean', 'array'] },
                    allow: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            unassigned: 'Imported module should be assigned',
        },
    },
    defaultOptions: [],
    create(context) {
        const options = context.options[0] || {};
        const filename = context.physicalFilename;
        const isAllow = (source) => testIsAllow(options.allow, filename, source);
        return {
            ImportDeclaration(node) {
                if (node.specifiers.length === 0 && !isAllow(node.source.value)) {
                    context.report({
                        node,
                        messageId: 'unassigned',
                    });
                }
            },
            ExpressionStatement(node) {
                if (node.expression.type === 'CallExpression' &&
                    (0, utils_1.isStaticRequire)(node.expression) &&
                    'value' in node.expression.arguments[0] &&
                    typeof node.expression.arguments[0].value === 'string' &&
                    !isAllow(node.expression.arguments[0].value)) {
                    context.report({
                        node: node.expression,
                        messageId: 'unassigned',
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=no-unassigned-import.js.map