type Options = {
    allow?: string[];
    forbid?: string[];
};
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<"noAllowed", [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
