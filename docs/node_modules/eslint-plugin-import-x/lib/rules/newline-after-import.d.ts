import type { TSESLint } from '@typescript-eslint/utils';
type Options = {
    count?: number;
    exactCount?: boolean;
    considerComments?: boolean;
};
declare const _default: TSESLint.RuleModule<"newline", [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, TSESLint.RuleListener>;
export = _default;
