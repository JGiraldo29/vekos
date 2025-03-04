"use strict";
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
const source_type_1 = tslib_1.__importDefault(require("../utils/source-type"));
module.exports = (0, utils_1.createRule)({
    name: 'no-default-export',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Style guide',
            description: 'Forbid default exports.',
        },
        schema: [],
        messages: {
            preferNamed: 'Prefer named exports.',
            noAliasDefault: 'Do not alias `{{local}}` as `default`. Just export `{{local}}` itself instead.',
        },
    },
    defaultOptions: [],
    create(context) {
        if ((0, source_type_1.default)(context) !== 'module') {
            return {};
        }
        const { sourceCode } = context;
        return {
            ExportDefaultDeclaration(node) {
                const { loc } = sourceCode.getFirstTokens(node)[1] || {};
                context.report({
                    node,
                    messageId: 'preferNamed',
                    loc,
                });
            },
            ExportNamedDeclaration(node) {
                for (const specifier of node.specifiers.filter(specifier => (0, utils_1.getValue)(specifier.exported) === 'default')) {
                    const { loc } = sourceCode.getFirstTokens(node)[1] || {};
                    if (specifier.type === 'ExportDefaultSpecifier') {
                        context.report({
                            node,
                            messageId: 'preferNamed',
                            loc,
                        });
                    }
                    else if (specifier.type === 'ExportSpecifier') {
                        context.report({
                            node,
                            messageId: 'noAliasDefault',
                            data: {
                                local: (0, utils_1.getValue)(specifier.local),
                            },
                            loc,
                        });
                    }
                }
            },
        };
    },
});
//# sourceMappingURL=no-default-export.js.map