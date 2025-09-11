"use strict";
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
const source_type_1 = tslib_1.__importDefault(require("../utils/source-type"));
module.exports = (0, utils_1.createRule)({
    name: 'no-named-export',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Style guide',
            description: 'Forbid named exports.',
        },
        schema: [],
        messages: {
            noAllowed: 'Named exports are not allowed.',
        },
    },
    defaultOptions: [],
    create(context) {
        if ((0, source_type_1.default)(context) !== 'module') {
            return {};
        }
        return {
            ExportAllDeclaration(node) {
                context.report({ node, messageId: 'noAllowed' });
            },
            ExportNamedDeclaration(node) {
                if (node.specifiers.length === 0) {
                    return context.report({ node, messageId: 'noAllowed' });
                }
                const someNamed = node.specifiers.some(specifier => (0, utils_1.getValue)(specifier.exported) !== 'default');
                if (someNamed) {
                    context.report({ node, messageId: 'noAllowed' });
                }
            },
        };
    },
});
//# sourceMappingURL=no-named-export.js.map