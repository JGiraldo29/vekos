import { QuansyncInput, QuansyncFn, QuansyncGenerator } from './types.js';
export { QuansyncAwaitableGenerator, QuansyncGeneratorFn, QuansyncInputObject } from './types.js';

declare const GET_IS_ASYNC: unique symbol;
declare class QuansyncError extends Error {
    constructor(message?: string);
}
/**
 * Creates a new Quansync function, a "superposition" between async and sync.
 */
declare function quansync<Return, Args extends any[] = []>(options: QuansyncInput<Return, Args> | Promise<Return>): QuansyncFn<Return, Args>;
/**
 * Converts a promise to a Quansync generator.
 */
declare function toGenerator<T>(promise: Promise<T> | QuansyncGenerator<T> | T): QuansyncGenerator<T>;

export { GET_IS_ASYNC, QuansyncError, QuansyncFn, QuansyncGenerator, QuansyncInput, quansync, toGenerator };
