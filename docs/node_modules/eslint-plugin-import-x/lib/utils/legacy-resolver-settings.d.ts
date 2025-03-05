import type { LiteralUnion } from 'type-fest';
import type { NodeResolverOptions, ResolvedResult, TsResolverOptions, WebpackResolverOptions } from '../types';
export type LegacyResolverName = LiteralUnion<'node' | 'typescript' | 'webpack', string>;
export type LegacyResolverResolveImport<T = unknown> = (modulePath: string, sourceFile: string, config: T) => string | undefined;
export type LegacyResolverResolve<T = unknown> = (modulePath: string, sourceFile: string, config: T) => ResolvedResult;
export type LegacyResolver<T = unknown, U = T> = {
    interfaceVersion?: 1 | 2;
    resolve: LegacyResolverResolve<T>;
    resolveImport: LegacyResolverResolveImport<U>;
};
export type LegacyResolverObject = {
    name: LegacyResolverName;
    enable?: boolean;
    options?: NodeResolverOptions | TsResolverOptions | WebpackResolverOptions | unknown;
    resolver: LegacyResolver;
};
export type LegacyResolverRecord = {
    node?: boolean | NodeResolverOptions;
    typescript?: boolean | TsResolverOptions;
    webpack?: WebpackResolverOptions;
    [resolve: string]: unknown;
};
export type LegacyImportResolver = LegacyResolverName | LegacyResolverRecord | LegacyResolverObject | LegacyResolverName[] | LegacyResolverRecord[] | LegacyResolverObject[];
export declare function resolveWithLegacyResolver(resolver: LegacyResolver, config: unknown, modulePath: string, sourceFile: string): ResolvedResult;
export declare function normalizeConfigResolvers(resolvers: LegacyImportResolver, sourceFile: string): Required<LegacyResolverObject>[];
