import { QuansyncInput, QuansyncFn } from './types.js';
export { QuansyncAwaitableGenerator, QuansyncGenerator, QuansyncGeneratorFn, QuansyncInputObject } from './types.js';

/**
 * This function is equivalent to `quansync` from main entry
 * but accepts a fake argument type of async functions.
 *
 * This requires to be used with the macro transformer `unplugin-quansync`.
 * Do NOT use it directly.
 *
 * @internal
 */
declare const quansync: <Return, Args extends any[] = []>(options: QuansyncInput<Return, Args> | ((...args: Args) => Promise<Return> | Return)) => QuansyncFn<Return, Args>;

export { QuansyncFn, QuansyncInput, quansync };
