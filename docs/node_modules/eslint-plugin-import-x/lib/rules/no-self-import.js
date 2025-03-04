"use strict";
const utils_1 = require("../utils");
function isImportingSelf(context, node, requireName) {
    const filename = context.physicalFilename;
    if (filename !== '<text>' && filename === (0, utils_1.resolve)(requireName, context)) {
        context.report({
            node,
            messageId: 'self',
        });
    }
}
module.exports = (0, utils_1.createRule)({
    name: 'no-self-import',
    meta: {
        type: 'problem',
        docs: {
            category: 'Static analysis',
            description: 'Forbid a module from importing itself.',
            recommended: true,
        },
        schema: [],
        messages: {
            self: 'Module imports itself.',
        },
    },
    defaultOptions: [],
    create(context) {
        return (0, utils_1.moduleVisitor)((source, node) => {
            isImportingSelf(context, node, source.value);
        }, { commonjs: true });
    },
});
//# sourceMappingURL=no-self-import.js.map