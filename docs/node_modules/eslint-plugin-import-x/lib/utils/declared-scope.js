"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaredScope = declaredScope;
function declaredScope(context, node, name) {
    const references = context.sourceCode.getScope(node).references;
    const reference = references.find(x => x.identifier.name === name);
    if (!reference || !reference.resolved) {
        return;
    }
    return reference.resolved.scope.type;
}
//# sourceMappingURL=declared-scope.js.map