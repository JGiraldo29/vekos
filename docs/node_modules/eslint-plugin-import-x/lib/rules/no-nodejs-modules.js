"use strict";
const utils_1 = require("../utils");
module.exports = (0, utils_1.createRule)({
    name: 'no-nodejs-modules',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Module systems',
            description: 'Forbid Node.js builtin modules.',
        },
        schema: [
            {
                type: 'object',
                properties: {
                    allow: {
                        type: 'array',
                        uniqueItems: true,
                        items: {
                            type: 'string',
                        },
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            builtin: 'Do not import Node.js builtin module "{{moduleName}}"',
        },
    },
    defaultOptions: [],
    create(context) {
        const options = context.options[0] || {};
        const allowed = options.allow || [];
        return (0, utils_1.moduleVisitor)((source, node) => {
            const moduleName = source.value;
            if (!allowed.includes(moduleName) &&
                (0, utils_1.importType)(moduleName, context) === 'builtin') {
                context.report({
                    node,
                    messageId: 'builtin',
                    data: {
                        moduleName,
                    },
                });
            }
        }, { commonjs: true });
    },
});
//# sourceMappingURL=no-nodejs-modules.js.map