type Options = {
    target?: 'single' | 'any';
};
type MessageId = 'single' | 'any';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
