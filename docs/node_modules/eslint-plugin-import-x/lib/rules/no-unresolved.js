"use strict";
const utils_1 = require("../utils");
module.exports = (0, utils_1.createRule)({
    name: 'no-unresolved',
    meta: {
        type: 'problem',
        docs: {
            category: 'Static analysis',
            description: 'Ensure imports point to a file/module that can be resolved.',
        },
        schema: [
            (0, utils_1.makeOptionsSchema)({
                caseSensitive: { type: 'boolean', default: true },
                caseSensitiveStrict: { type: 'boolean' },
            }),
        ],
        messages: {
            unresolved: "Unable to resolve path to module '{{module}}'.",
            casingMismatch: 'Casing of {{module}} does not match the underlying filesystem.',
        },
    },
    defaultOptions: [],
    create(context) {
        const options = context.options[0] || {};
        return (0, utils_1.moduleVisitor)(function checkSourceValue(source, node) {
            if (('importKind' in node && node.importKind === 'type') ||
                ('exportKind' in node && node.exportKind === 'type')) {
                return;
            }
            const caseSensitive = !utils_1.CASE_SENSITIVE_FS && options.caseSensitive !== false;
            const caseSensitiveStrict = !utils_1.CASE_SENSITIVE_FS && options.caseSensitiveStrict;
            const resolvedPath = (0, utils_1.resolve)(source.value, context);
            if (resolvedPath === undefined) {
                context.report({
                    node: source,
                    messageId: 'unresolved',
                    data: {
                        module: source.value,
                    },
                });
            }
            else if (caseSensitive || caseSensitiveStrict) {
                const cacheSettings = utils_1.ModuleCache.getSettings(context.settings);
                if (!(0, utils_1.fileExistsWithCaseSync)(resolvedPath, cacheSettings, caseSensitiveStrict)) {
                    context.report({
                        node: source,
                        messageId: 'casingMismatch',
                        data: {
                            module: source.value,
                        },
                    });
                }
            }
        }, options);
    },
});
//# sourceMappingURL=no-unresolved.js.map