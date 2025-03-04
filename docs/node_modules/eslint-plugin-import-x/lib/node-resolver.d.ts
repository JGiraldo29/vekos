import type { ResolveOptions } from 'enhanced-resolve';
import type { NewResolver } from './types';
type NodeResolverOptions = {
    extensions?: string[];
    conditionNames?: string[];
} & Omit<ResolveOptions, 'useSyncFileSystemCalls'>;
export declare function createNodeResolver({ extensions, conditionNames, mainFields: _mainFields, exportsFields: _exportsFields, mainFiles: _mainFiles, fileSystem, ...restOptions }?: Partial<NodeResolverOptions>): NewResolver;
export {};
