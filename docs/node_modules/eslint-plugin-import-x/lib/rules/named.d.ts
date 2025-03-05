import type { ModuleOptions } from '../utils';
type MessageId = 'notFound' | 'notFoundDeep';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [(ModuleOptions | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
