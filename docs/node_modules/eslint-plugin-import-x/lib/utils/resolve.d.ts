import type { ImportSettings, LegacyResolver, NewResolver, PluginSettings, RuleContext } from '../types';
import { ModuleCache } from './module-cache';
export declare const CASE_SENSITIVE_FS: boolean;
export declare const IMPORT_RESOLVE_ERROR_NAME = "EslintPluginImportResolveError";
export declare const fileExistsCache: ModuleCache;
export declare function fileExistsWithCaseSync(filepath: string | null, cacheSettings?: ImportSettings['cache'], strict?: boolean): boolean;
export declare function relative(modulePath: string, sourceFile: string, settings: PluginSettings): string | null | undefined;
export declare function resolve(p: string, context: RuleContext): string | null | undefined;
export declare function importXResolverCompat(resolver: LegacyResolver | NewResolver, resolverOptions?: unknown): NewResolver;
