import type { ModuleOptions } from '../utils';
type Options = {
    allowUnsafeDynamicCyclicDependency?: boolean;
    ignoreExternal?: boolean;
    maxDepth?: number | '∞';
} & ModuleOptions;
type MessageId = 'cycle' | 'cycleSource';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
