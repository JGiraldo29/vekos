"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMaybeUnambiguousModule = isMaybeUnambiguousModule;
exports.isUnambiguousModule = isUnambiguousModule;
const pattern = /(^|;)\s*(export|import)((\s+\w)|(\s*[*={]))|import\(/m;
function isMaybeUnambiguousModule(content) {
    return pattern.test(content);
}
const unambiguousNodeType = /^(?:(?:Exp|Imp)ort.*Declaration|TSExportAssignment)$/;
function isUnambiguousModule(ast) {
    return ast.body && ast.body.some(node => unambiguousNodeType.test(node.type));
}
//# sourceMappingURL=unambiguous.js.map