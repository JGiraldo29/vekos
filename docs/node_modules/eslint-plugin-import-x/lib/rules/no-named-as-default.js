"use strict";
const utils_1 = require("../utils");
module.exports = (0, utils_1.createRule)({
    name: 'no-named-as-default',
    meta: {
        type: 'problem',
        docs: {
            category: 'Helpful warnings',
            description: 'Forbid use of exported name as identifier of default export.',
        },
        schema: [],
        messages: {
            default: "Using exported name '{{name}}' as identifier for default export.",
        },
    },
    defaultOptions: [],
    create(context) {
        function createCheckDefault(nameKey) {
            return function checkDefault(defaultSpecifier) {
                const nameValue = defaultSpecifier[nameKey].name;
                if (nameValue === 'default') {
                    return;
                }
                const declaration = (0, utils_1.importDeclaration)(context, defaultSpecifier);
                const exportMapOfImported = utils_1.ExportMap.get(declaration.source.value, context);
                if (exportMapOfImported == null) {
                    return;
                }
                if (exportMapOfImported.errors.length > 0) {
                    exportMapOfImported.reportErrors(context, declaration);
                    return;
                }
                if (!exportMapOfImported.hasDefault) {
                    return;
                }
                if (!exportMapOfImported.has(nameValue)) {
                    return;
                }
                if (exportMapOfImported.exports.has('default') &&
                    exportMapOfImported.exports.has(nameValue)) {
                    context.report({
                        node: defaultSpecifier,
                        messageId: 'default',
                        data: {
                            name: nameValue,
                        },
                    });
                }
            };
        }
        return {
            ImportDefaultSpecifier: createCheckDefault('local'),
            ExportDefaultSpecifier: createCheckDefault('exported'),
        };
    },
});
//# sourceMappingURL=no-named-as-default.js.map