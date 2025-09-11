import type { TSESLint } from '@typescript-eslint/utils';
type Options = 'absolute-first' | 'disable-absolute-first';
type MessageId = 'absolute' | 'order';
declare const _default: TSESLint.RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, TSESLint.RuleListener>;
export = _default;
