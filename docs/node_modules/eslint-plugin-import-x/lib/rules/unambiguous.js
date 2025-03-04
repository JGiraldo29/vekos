"use strict";
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
const source_type_1 = tslib_1.__importDefault(require("../utils/source-type"));
module.exports = (0, utils_1.createRule)({
    name: 'unambiguous',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Module systems',
            description: 'Forbid potentially ambiguous parse goal (`script` vs. `module`).',
        },
        schema: [],
        messages: {
            module: 'This module could be parsed as a valid script.',
        },
    },
    defaultOptions: [],
    create(context) {
        if ((0, source_type_1.default)(context) !== 'module') {
            return {};
        }
        return {
            Program(ast) {
                if (!(0, utils_1.isUnambiguousModule)(ast)) {
                    context.report({
                        node: ast,
                        messageId: 'module',
                    });
                }
            },
        };
    },
});
//# sourceMappingURL=unambiguous.js.map