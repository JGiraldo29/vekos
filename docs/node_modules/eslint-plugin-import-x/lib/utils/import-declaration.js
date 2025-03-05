"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importDeclaration = void 0;
const utils_1 = require("@typescript-eslint/utils");
const importDeclaration = (context, node) => {
    if (node.parent && node.parent.type === utils_1.AST_NODE_TYPES.ImportDeclaration) {
        return node.parent;
    }
    const ancestors = context.sourceCode.getAncestors(node);
    return ancestors[ancestors.length - 1];
};
exports.importDeclaration = importDeclaration;
//# sourceMappingURL=import-declaration.js.map