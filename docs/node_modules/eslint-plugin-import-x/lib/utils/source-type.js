"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sourceType;
function sourceType(context) {
    if ('sourceType' in context.parserOptions) {
        return context.parserOptions.sourceType;
    }
    if ('languageOptions' in context && context.languageOptions) {
        return context.languageOptions.sourceType;
    }
}
//# sourceMappingURL=source-type.js.map