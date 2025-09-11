type Options = {
    src?: string[];
    ignoreExports?: string[];
    missingExports?: true;
    unusedExports?: boolean;
    ignoreUnusedTypeExports?: boolean;
};
type MessageId = 'notFound' | 'unused';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, Options[], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
