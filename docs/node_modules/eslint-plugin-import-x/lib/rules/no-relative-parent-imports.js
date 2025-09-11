"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const utils_1 = require("../utils");
module.exports = (0, utils_1.createRule)({
    name: 'no-relative-parent-imports',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Static analysis',
            description: 'Forbid importing modules from parent directories.',
        },
        schema: [(0, utils_1.makeOptionsSchema)()],
        messages: {
            noAllowed: "Relative imports from parent directories are not allowed. Please either pass what you're importing through at runtime (dependency injection), move `{{filename}}` to same directory as `{{depPath}}` or consider making `{{depPath}}` a package.",
        },
    },
    defaultOptions: [],
    create(context) {
        const filename = context.physicalFilename;
        if (filename === '<text>') {
            return {};
        }
        return (0, utils_1.moduleVisitor)(sourceNode => {
            const depPath = sourceNode.value;
            if ((0, utils_1.importType)(depPath, context) === 'external') {
                return;
            }
            const absDepPath = (0, utils_1.resolve)(depPath, context);
            if (!absDepPath) {
                return;
            }
            const relDepPath = node_path_1.default.relative(node_path_1.default.dirname(filename), absDepPath);
            if ((0, utils_1.importType)(relDepPath, context) === 'parent') {
                context.report({
                    node: sourceNode,
                    messageId: 'noAllowed',
                    data: {
                        filename: node_path_1.default.basename(filename),
                        depPath,
                    },
                });
            }
        }, context.options[0]);
    },
});
//# sourceMappingURL=no-relative-parent-imports.js.map