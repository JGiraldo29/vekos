type MessageId = 'noNamesFound' | 'computedReference' | 'namespaceMember' | 'topLevelNames' | 'notFoundInNamespace' | 'notFoundInNamespaceDeep';
type Options = {
    allowComputed?: boolean;
};
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [Options], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
