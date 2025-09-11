import { CompilationContext, JsPlugin } from '@farmfe/core';
import { Compiler as Compiler$1, Compilation as Compilation$1, LoaderContext as LoaderContext$1, RspackPluginInstance } from '@rspack/core';
export { Compiler as RspackCompiler, RspackPluginInstance } from '@rspack/core';
import { PluginBuild, Loader, BuildOptions, Plugin as Plugin$4 } from 'esbuild';
export { Plugin as EsbuildPlugin } from 'esbuild';
import { Plugin as Plugin$3 } from 'rolldown';
export { Plugin as RolldownPlugin } from 'rolldown';
import { PluginContextMeta, EmittedAsset, AstNode, SourceMapInput, Plugin } from 'rollup';
export { Plugin as RollupPlugin } from 'rollup';
import { Plugin as Plugin$2 } from 'unloader';
export { Plugin as UnloaderPlugin } from 'unloader';
import { Plugin as Plugin$1 } from 'vite';
export { Plugin as VitePlugin } from 'vite';
import { Compiler, Compilation, LoaderContext, WebpackPluginInstance } from 'webpack';
export { Compiler as WebpackCompiler, WebpackPluginInstance } from 'webpack';
import VirtualModulesPlugin from 'webpack-virtual-modules';

type Thenable<T> = T | Promise<T>;
/**
 * Null or whatever
 */
type Nullable<T> = T | null | undefined;
/**
 * Array, or not yet
 */
type Arrayable<T> = T | Array<T>;
interface SourceMapCompact {
    file?: string;
    mappings: string;
    names: string[];
    sourceRoot?: string;
    sources: string[];
    sourcesContent?: (string | null)[];
    version: number;
}
type TransformResult = string | {
    code: string;
    map?: SourceMapInput | SourceMapCompact | null;
} | null | undefined | void;
interface ExternalIdResult {
    id: string;
    external?: boolean;
}
type NativeBuildContext = {
    framework: 'webpack';
    compiler: Compiler;
    compilation?: Compilation;
    loaderContext?: LoaderContext<{
        unpluginName: string;
    }>;
} | {
    framework: 'esbuild';
    build: PluginBuild;
} | {
    framework: 'rspack';
    compiler: Compiler$1;
    compilation: Compilation$1;
    loaderContext?: LoaderContext$1;
} | {
    framework: 'farm';
    context: CompilationContext;
};
interface UnpluginBuildContext {
    addWatchFile: (id: string) => void;
    emitFile: (emittedFile: EmittedAsset) => void;
    getWatchFiles: () => string[];
    parse: (input: string, options?: any) => AstNode;
    getNativeBuildContext?: () => NativeBuildContext;
}
interface UnpluginOptions {
    name: string;
    enforce?: 'post' | 'pre' | undefined;
    buildStart?: (this: UnpluginBuildContext) => Promise<void> | void;
    buildEnd?: (this: UnpluginBuildContext) => Promise<void> | void;
    transform?: (this: UnpluginBuildContext & UnpluginContext, code: string, id: string) => Thenable<TransformResult>;
    load?: (this: UnpluginBuildContext & UnpluginContext, id: string) => Thenable<TransformResult>;
    resolveId?: (this: UnpluginBuildContext & UnpluginContext, id: string, importer: string | undefined, options: {
        isEntry: boolean;
    }) => Thenable<string | ExternalIdResult | null | undefined>;
    watchChange?: (this: UnpluginBuildContext, id: string, change: {
        event: 'create' | 'update' | 'delete';
    }) => void;
    writeBundle?: (this: void) => Promise<void> | void;
    /**
     * Custom predicate function to filter modules to be loaded.
     * When omitted, all modules will be included (might have potential perf impact on Webpack).
     */
    loadInclude?: (id: string) => boolean | null | undefined;
    /**
     * Custom predicate function to filter modules to be transformed.
     * When omitted, all modules will be included (might have potential perf impact on Webpack).
     */
    transformInclude?: (id: string) => boolean | null | undefined;
    rollup?: Partial<Plugin>;
    webpack?: (compiler: Compiler) => void;
    rspack?: (compiler: Compiler$1) => void;
    vite?: Partial<Plugin$1>;
    unloader?: Partial<Plugin$2>;
    rolldown?: Partial<Plugin$3>;
    esbuild?: {
        onResolveFilter?: RegExp;
        onLoadFilter?: RegExp;
        loader?: Loader | ((code: string, id: string) => Loader);
        setup?: (build: PluginBuild) => void | Promise<void>;
        config?: (options: BuildOptions) => void;
    };
    farm?: Partial<JsPlugin>;
}
interface ResolvedUnpluginOptions extends UnpluginOptions {
    __vfs?: VirtualModulesPlugin;
    __vfsModules?: Set<string>;
    __virtualModulePrefix: string;
}
type UnpluginFactory<UserOptions, Nested extends boolean = boolean> = (options: UserOptions, meta: UnpluginContextMeta) => Nested extends true ? Array<UnpluginOptions> : UnpluginOptions;
type UnpluginFactoryOutput<UserOptions, Return> = undefined extends UserOptions ? (options?: UserOptions) => Return : (options: UserOptions) => Return;
interface UnpluginInstance<UserOptions, Nested extends boolean = boolean> {
    rollup: UnpluginFactoryOutput<UserOptions, Nested extends true ? Array<Plugin> : Plugin>;
    vite: UnpluginFactoryOutput<UserOptions, Nested extends true ? Array<Plugin$1> : Plugin$1>;
    rolldown: UnpluginFactoryOutput<UserOptions, Nested extends true ? Array<Plugin$3> : Plugin$3>;
    webpack: UnpluginFactoryOutput<UserOptions, WebpackPluginInstance>;
    rspack: UnpluginFactoryOutput<UserOptions, RspackPluginInstance>;
    esbuild: UnpluginFactoryOutput<UserOptions, Plugin$4>;
    unloader: UnpluginFactoryOutput<UserOptions, Nested extends true ? Array<Plugin$2> : Plugin$2>;
    farm: UnpluginFactoryOutput<UserOptions, JsPlugin>;
    raw: UnpluginFactory<UserOptions, Nested>;
}
type UnpluginContextMeta = Partial<PluginContextMeta> & ({
    framework: 'rollup' | 'vite' | 'rolldown' | 'farm' | 'unloader';
} | {
    framework: 'webpack';
    webpack: {
        compiler: Compiler;
    };
} | {
    framework: 'esbuild';
    /** Set the host plugin name of esbuild when returning multiple plugins */
    esbuildHostName?: string;
} | {
    framework: 'rspack';
    rspack: {
        compiler: Compiler$1;
    };
});
interface UnpluginMessage {
    name?: string;
    id?: string;
    message: string;
    stack?: string;
    code?: string;
    plugin?: string;
    pluginCode?: unknown;
    loc?: {
        column: number;
        file?: string;
        line: number;
    };
    meta?: any;
}
interface UnpluginContext {
    error: (message: string | UnpluginMessage) => void;
    warn: (message: string | UnpluginMessage) => void;
}

declare function createUnplugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions, Nested>;
declare function createEsbuildPlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['esbuild'];
declare function createRollupPlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['rollup'];
declare function createVitePlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['vite'];
/** @experimental do not use it in production */
declare function createRolldownPlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['rolldown'];
declare function createWebpackPlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['webpack'];
declare function createRspackPlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['rspack'];
declare function createFarmPlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['farm'];
declare function createUnloaderPlugin<UserOptions, Nested extends boolean = boolean>(factory: UnpluginFactory<UserOptions, Nested>): UnpluginInstance<UserOptions>['unloader'];

export { type Arrayable, type ExternalIdResult, type NativeBuildContext, type Nullable, type ResolvedUnpluginOptions, type SourceMapCompact, type Thenable, type TransformResult, type UnpluginBuildContext, type UnpluginContext, type UnpluginContextMeta, type UnpluginFactory, type UnpluginFactoryOutput, type UnpluginInstance, type UnpluginMessage, type UnpluginOptions, createEsbuildPlugin, createFarmPlugin, createRolldownPlugin, createRollupPlugin, createRspackPlugin, createUnloaderPlugin, createUnplugin, createVitePlugin, createWebpackPlugin };
