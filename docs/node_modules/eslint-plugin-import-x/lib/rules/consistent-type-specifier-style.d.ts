import type { TSESLint } from '@typescript-eslint/utils';
type Options = 'prefer-inline' | 'prefer-top-level';
type MessageId = 'inline' | 'topLevel';
declare const _default: TSESLint.RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, TSESLint.RuleListener>;
export = _default;
