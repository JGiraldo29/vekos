import type { Hash } from 'node:crypto';
export declare function hashify(value?: unknown, hash?: Hash): Hash;
export declare function hashArray(array: unknown[], hash?: Hash): Hash;
export declare function hashObject<T extends object = object>(object: T, hash?: Hash): Hash;
