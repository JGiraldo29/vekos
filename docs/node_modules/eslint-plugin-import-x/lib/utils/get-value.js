"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValue = void 0;
const utils_1 = require("@typescript-eslint/utils");
const getValue = (node) => {
    switch (node.type) {
        case utils_1.TSESTree.AST_NODE_TYPES.Identifier: {
            return node.name;
        }
        case utils_1.TSESTree.AST_NODE_TYPES.Literal: {
            return node.value;
        }
        default: {
            throw new Error(`Unsupported node type: ${node.type}`);
        }
    }
};
exports.getValue = getValue;
//# sourceMappingURL=get-value.js.map