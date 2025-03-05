"use strict";
const tslib_1 = require("tslib");
const utils_1 = require("../utils");
const first_1 = tslib_1.__importDefault(require("./first"));
module.exports = (0, utils_1.createRule)({
    ...first_1.default,
    name: 'imports-first',
    meta: {
        ...first_1.default.meta,
        deprecated: true,
        docs: {
            category: 'Style guide',
            description: 'Replaced by `import-x/first`.',
        },
    },
});
//# sourceMappingURL=imports-first.js.map