type Options = {
    allowEmpty?: boolean;
    importFunctions?: readonly string[];
    webpackChunknameFormat?: string;
};
type MessageId = 'leadingComment' | 'blockComment' | 'paddedSpaces' | 'webpackComment' | 'chunknameFormat' | 'webpackEagerModeNoChunkName' | 'webpackRemoveEagerMode' | 'webpackRemoveChunkName';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
