import type { TSESLint } from '@typescript-eslint/utils';
type Options = {
    exceptions?: string[];
};
declare const _default: TSESLint.RuleModule<"notAllowed", [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, TSESLint.RuleListener>;
export = _default;
