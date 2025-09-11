import type { Hookable } from 'hookable';
export declare function setupHooksDebug<T extends Hookable<any>>(hooks: T): Record<string, HookInfo>;
