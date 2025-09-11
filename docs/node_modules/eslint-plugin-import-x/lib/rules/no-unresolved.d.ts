import type { ModuleOptions } from '../utils';
type Options = ModuleOptions & {
    caseSensitive?: boolean;
    caseSensitiveStrict?: boolean;
};
type MessageId = 'unresolved' | 'casingMismatch';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
