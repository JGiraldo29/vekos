"use strict";
const tslib_1 = require("tslib");
const node_path_1 = tslib_1.__importDefault(require("node:path"));
const utils_1 = require("../utils");
module.exports = (0, utils_1.createRule)({
    name: 'no-absolute-path',
    meta: {
        type: 'suggestion',
        docs: {
            category: 'Static analysis',
            description: 'Forbid import of modules using absolute paths.',
        },
        fixable: 'code',
        schema: [(0, utils_1.makeOptionsSchema)()],
        messages: {
            absolute: 'Do not import modules using an absolute path',
        },
    },
    defaultOptions: [],
    create(context) {
        const options = { esmodule: true, commonjs: true, ...context.options[0] };
        return (0, utils_1.moduleVisitor)(source => {
            if (!(0, utils_1.isAbsolute)(source.value)) {
                return;
            }
            context.report({
                node: source,
                messageId: 'absolute',
                fix(fixer) {
                    let relativePath = node_path_1.default.posix.relative(node_path_1.default.dirname(context.physicalFilename), source.value);
                    if (!relativePath.startsWith('.')) {
                        relativePath = `./${relativePath}`;
                    }
                    return fixer.replaceText(source, JSON.stringify(relativePath));
                },
            });
        }, options);
    },
});
//# sourceMappingURL=no-absolute-path.js.map