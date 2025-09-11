import { AsyncLocalStorage } from 'node:async_hooks';
import type { Context } from './context.js';
interface RequestStoreContent {
    cdnLoopHeader: string | null;
    context: Context;
}
export declare const requestStore: AsyncLocalStorage<RequestStoreContent>;
export {};
