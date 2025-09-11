import type { Arrayable } from '../types';
type Options = {
    basePath?: string;
    zones?: Array<{
        from: Arrayable<string>;
        target: Arrayable<string>;
        message?: string;
        except?: string[];
    }>;
};
type MessageId = 'path' | 'mixedGlob' | 'glob' | 'zone';
declare const _default: import("@typescript-eslint/utils/ts-eslint").RuleModule<MessageId, [(Options | undefined)?], {
    category?: string;
    recommended?: true;
}, import("@typescript-eslint/utils/ts-eslint").RuleListener>;
export = _default;
