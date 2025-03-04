import type { TSESLint } from '@typescript-eslint/utils';
type Options = {
    ignore?: string[];
};
declare const _default: TSESLint.RuleModule<"noNamespace", [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, TSESLint.RuleListener>;
export = _default;
