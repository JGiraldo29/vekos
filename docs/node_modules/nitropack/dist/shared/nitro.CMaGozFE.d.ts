import { LogLevel, ConsolaInstance } from 'consola';
import { App, RouterMethod, EventHandler, H3Error, H3Event, ProxyOptions } from 'h3';
import { NestedHooks, Hookable } from 'hookable';
import { PresetName, PresetOptions, PresetNameInput } from 'nitropack/presets';
import { Unimport } from 'unimport';
import { BuiltinDriverName, Storage } from 'unstorage';
import { RollupCommonJSOptions } from '@rollup/plugin-commonjs';
import { ResolvedConfig, ConfigWatcher, C12InputConfig, WatchConfigOptions } from 'c12';
import { FSWatcher, WatchOptions } from 'chokidar';
import { DateString, CompatibilityDates, CompatibilityDateSpec } from 'compatx';
import { ConnectorName } from 'db0';
import { ProxyServerOptions } from 'httpxy';
import { NitroRuntimeConfigApp as NitroRuntimeConfigApp$1, NitroRuntimeConfig as NitroRuntimeConfig$1 } from 'nitropack';
import { TSConfig } from 'pkg-types';
import { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import { Preset } from 'unenv';
import { UnimportPluginOptions } from 'unimport/unplugin';
import { UnwasmPluginOptions } from 'unwasm/plugin';
import { IncomingMessage, OutgoingMessage } from 'node:http';
import { Duplex } from 'node:stream';
import { Worker } from 'node:worker_threads';
import { ListenOptions, Listener } from 'listhen';
import { OperationObject } from 'openapi-typescript';
import { FilterPattern } from '@rollup/pluginutils';
import { NodeFileTraceOptions } from '@vercel/nft';
import { TransformOptions, Loader } from 'esbuild';
import { InputOptions, OutputOptions } from 'rollup';
import { ReferenceConfiguration } from '@scalar/api-reference';
import { ProviderName } from 'std-env';

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;
type ExcludeFunctions<G extends Record<string, any>> = Pick<G, {
    [P in keyof G]: NonNullable<G[P]> extends Function ? never : P;
}[keyof G]>;
type DeepPartial<T> = T extends Record<string, any> ? {
    [P in keyof T]?: DeepPartial<T[P]> | T[P];
} : T;

interface DevServerOptions {
    watch: string[];
}
interface NitroWorker {
    worker: Worker | null;
    address: {
        host: string;
        port: number;
        socketPath?: string;
    };
}
interface NitroDevServer {
    reload: () => void;
    listen: (port: ListenOptions["port"], opts?: Partial<ListenOptions>) => Promise<Listener>;
    app: App;
    close: () => Promise<void>;
    watcher?: FSWatcher;
    upgrade: (req: IncomingMessage, socket: OutgoingMessage<IncomingMessage> | Duplex, head: Buffer) => void;
}

type MaybeArray<T> = T | T[];
/** @exprerimental */
interface NitroRouteMeta {
    openAPI?: OperationObject;
}
interface NitroEventHandler {
    /**
     * Path prefix or route
     *
     * If an empty string used, will be used as a middleware
     */
    route?: string;
    /**
     * Specifies this is a middleware handler.
     * Middleware are called on every route and should normally return nothing to pass to the next handlers
     */
    middleware?: boolean;
    /**
     * Use lazy loading to import handler
     */
    lazy?: boolean;
    /**
     * Path to event handler
     *
     */
    handler: string;
    /**
     * Router method matcher
     */
    method?: RouterMethod;
    /**
     * Meta
     */
    meta?: NitroRouteMeta;
    env?: MaybeArray<"dev" | "prod" | "prerender" | PresetName | (string & {})>;
}
interface NitroDevEventHandler {
    /**
     * Path prefix or route
     */
    route?: string;
    /**
     * Event handler
     *
     */
    handler: EventHandler;
}
type NitroErrorHandler = (error: H3Error, event: H3Event) => void | Promise<void>;

interface PrerenderRoute {
    route: string;
    contents?: string;
    data?: ArrayBuffer;
    fileName?: string;
    error?: Error & {
        statusCode: number;
        statusMessage: string;
    };
    generateTimeMS?: number;
    skip?: boolean;
    contentType?: string;
}
/** @deprecated Internal type will be removed in future versions */
type PrerenderGenerateRoute = PrerenderRoute;

type RollupConfig = InputOptions & {
    output: OutputOptions;
};
type VirtualModule = string | (() => string | Promise<string>);
interface RollupVirtualOptions {
    [id: string]: VirtualModule;
}
interface EsbuildOptions extends TransformOptions {
    include?: FilterPattern;
    exclude?: FilterPattern;
    sourceMap?: boolean | "inline" | "hidden";
    /**
     * Map extension to esbuild loader
     * Note that each entry (the extension) needs to start with a dot
     */
    loaders?: {
        [ext: string]: Loader | false;
    };
}
interface NodeExternalsOptions {
    inline?: Array<string | RegExp | ((id: string, importer?: string) => Promise<boolean> | boolean)>;
    external?: Array<string | RegExp | ((id: string, importer?: string) => Promise<boolean> | boolean)>;
    rootDir?: string;
    outDir: string;
    trace?: boolean;
    traceOptions?: NodeFileTraceOptions;
    moduleDirectories?: string[];
    exportConditions?: string[];
    traceInclude?: string[];
    traceAlias?: Record<string, string>;
}
interface ServerAssetOptions {
    inline: boolean;
    dirs: {
        [assetdir: string]: {
            dir: string;
            meta?: boolean;
        };
    };
}
interface RawOptions {
    extensions?: string[];
}

type HookResult = void | Promise<void>;
interface NitroHooks {
    "types:extend": (types: NitroTypes) => HookResult;
    "rollup:before": (nitro: Nitro, config: RollupConfig) => HookResult;
    compiled: (nitro: Nitro) => HookResult;
    "dev:reload": () => HookResult;
    "rollup:reload": () => HookResult;
    restart: () => HookResult;
    close: () => HookResult;
    "prerender:routes": (routes: Set<string>) => HookResult;
    "prerender:config": (config: NitroConfig) => HookResult;
    "prerender:init": (prerenderer: Nitro) => HookResult;
    "prerender:generate": (route: PrerenderRoute, nitro: Nitro) => HookResult;
    "prerender:route": (route: PrerenderRoute) => HookResult;
    "prerender:done": (result: {
        prerenderedRoutes: PrerenderRoute[];
        failedRoutes: PrerenderRoute[];
    }) => HookResult;
}

/**
 * Nitro OpenAPI configuration
 */
interface NitroOpenAPIConfig {
    /**
     * OpenAPI meta information
     */
    meta?: {
        title?: string;
        description?: string;
        version?: string;
    };
    /**
     * OpenAPI json route
     *
     * Default is `/_openapi.json`
     */
    route?: string;
    /**
     * Enable OpenAPI generation for production builds
     */
    production?: false | "runtime" | "prerender";
    /**
     * UI configurations
     */
    ui?: {
        /**
         * Scalar UI configuration
         */
        scalar?: false | (ReferenceConfiguration & {
            /**
             * Scalar UI route
             *
             * Default is `/_scalar`
             */
            route?: string;
        });
        /**
         * Swagger UI configuration
         */
        swagger?: false | {
            /**
             * Swagger UI route
             *
             * Default is `/_swagger`
             */
            route?: string;
        };
    };
}

type NitroPreset = NitroConfig | (() => NitroConfig);
interface NitroPresetMeta {
    url: string;
    name: string;
    stdName?: ProviderName;
    aliases?: string[];
    static?: boolean;
    compatibilityDate?: DateString;
}

interface CacheEntry<T = any> {
    value?: T;
    expires?: number;
    mtime?: number;
    integrity?: string;
}
interface CacheOptions<T = any, ArgsT extends unknown[] = any[]> {
    name?: string;
    getKey?: (...args: ArgsT) => string | Promise<string>;
    transform?: (entry: CacheEntry<T>, ...args: ArgsT) => any;
    validate?: (entry: CacheEntry<T>, ...args: ArgsT) => boolean;
    shouldInvalidateCache?: (...args: ArgsT) => boolean | Promise<boolean>;
    shouldBypassCache?: (...args: ArgsT) => boolean | Promise<boolean>;
    group?: string;
    integrity?: any;
    /**
     * Number of seconds to cache the response. Defaults to 1.
     */
    maxAge?: number;
    swr?: boolean;
    staleMaxAge?: number;
    base?: string;
}
interface ResponseCacheEntry<T = any> {
    body: T | undefined;
    code: number;
    headers: Record<string, string | number | string[] | undefined>;
}
interface CachedEventHandlerOptions<T = any> extends Omit<CacheOptions<ResponseCacheEntry<T>, [H3Event]>, "transform" | "validate"> {
    headersOnly?: boolean;
    varies?: string[] | readonly string[];
}

type HTTPStatusCode = IntRange<100, 600>;
interface NitroRouteConfig {
    cache?: ExcludeFunctions<CachedEventHandlerOptions> | false;
    headers?: Record<string, string>;
    redirect?: string | {
        to: string;
        statusCode?: HTTPStatusCode;
    };
    prerender?: boolean;
    proxy?: string | ({
        to: string;
    } & ProxyOptions);
    isr?: number | boolean | VercelISRConfig;
    cors?: boolean;
    swr?: boolean | number;
    static?: boolean | number;
}
interface NitroRouteRules extends Omit<NitroRouteConfig, "redirect" | "cors" | "swr" | "static"> {
    redirect?: {
        to: string;
        statusCode: HTTPStatusCode;
    };
    proxy?: {
        to: string;
    } & ProxyOptions;
}
interface VercelISRConfig {
    /**
     * (vercel)
     * Expiration time (in seconds) before the cached asset will be re-generated by invoking the Serverless Function.
     * Setting the value to `false` (or `isr: true` route rule) means it will never expire.
     */
    expiration?: number | false;
    /**
     * (vercel)
     * Group number of the asset.
     * Prerender assets with the same group number will all be re-validated at the same time.
     */
    group?: number;
    /**
     * (vercel)
     * List of query string parameter names that will be cached independently.
     * - If an empty array, query values are not considered for caching.
     * - If undefined each unique query value is cached independently
     * - For wildcard `/**` route rules, `url` is always added.
     */
    allowQuery?: string[];
    /**
     * (vercel)
     * When `true`, the query string will be present on the `request` argument passed to the invoked function. The `allowQuery` filter still applies.
     */
    passQuery?: boolean;
}

/**
 * Nitro normalized options (nitro.options)
 */
interface NitroOptions extends PresetOptions {
    _config: NitroConfig;
    _c12: ResolvedConfig<NitroConfig> | ConfigWatcher<NitroConfig>;
    _cli?: {
        command?: string;
    };
    compatibilityDate: CompatibilityDates;
    debug: boolean;
    preset: PresetName;
    static: boolean;
    logLevel: LogLevel;
    runtimeConfig: NitroRuntimeConfig;
    appConfig: AppConfig;
    appConfigFiles: string[];
    workspaceDir: string;
    rootDir: string;
    srcDir: string;
    scanDirs: string[];
    apiDir: string;
    routesDir: string;
    buildDir: string;
    output: {
        dir: string;
        serverDir: string;
        publicDir: string;
    };
    storage: StorageMounts;
    devStorage: StorageMounts;
    database: DatabaseConnectionConfigs;
    devDatabase: DatabaseConnectionConfigs;
    bundledStorage: string[];
    timing: boolean;
    renderer?: string;
    serveStatic: boolean | "node" | "deno" | "inline";
    noPublicDir: boolean;
    /**
     * @experimental Requires `experimental.wasm` to work
     *
     * @see https://github.com/unjs/unwasm
     */
    wasm?: UnwasmPluginOptions;
    openAPI?: NitroOpenAPIConfig;
    experimental: {
        legacyExternals?: boolean;
        openAPI?: boolean;
        /**
         * See https://github.com/microsoft/TypeScript/pull/51669
         */
        typescriptBundlerResolution?: boolean;
        /**
         * Enable native async context support for useEvent()
         */
        asyncContext?: boolean;
        /**
         * Enable Experimental WebAssembly Support
         *
         * @see https://github.com/unjs/unwasm
         */
        wasm?: boolean;
        /**
         * Disable Experimental bundling of Nitro Runtime Dependencies
         */
        bundleRuntimeDependencies?: false;
        /**
         * Disable Experimental Sourcemap Minification
         */
        sourcemapMinify?: false;
        /**
         * Backward compatibility support for Node fetch (required for Node < 18)
         */
        nodeFetchCompat?: boolean;
        /**
         * Allow env expansion in runtime config
         *
         * @see https://github.com/nitrojs/nitro/pull/2043
         */
        envExpansion?: boolean;
        /**
         * Enable experimental WebSocket support
         *
         * @see https://nitro.build/guide/websocket
         */
        websocket?: boolean;
        /**
         * Enable experimental Database support
         *
         * @see https://nitro.build/guide/database
         */
        database?: boolean;
        /**
         * Enable experimental Tasks support
         *
         * @see https://nitro.build/guide/tasks
         */
        tasks?: boolean;
    };
    future: {
        nativeSWR: boolean;
    };
    serverAssets: ServerAssetDir[];
    publicAssets: PublicAssetDir[];
    imports: UnimportPluginOptions | false;
    modules?: NitroModuleInput[];
    plugins: string[];
    tasks: {
        [name: string]: {
            handler: string;
            description: string;
        };
    };
    scheduledTasks: {
        [cron: string]: string | string[];
    };
    virtual: Record<string, string | (() => string | Promise<string>)>;
    compressPublicAssets: boolean | CompressOptions;
    ignore: string[];
    dev: boolean;
    devServer: DevServerOptions;
    watchOptions: WatchOptions;
    devProxy: Record<string, string | ProxyServerOptions>;
    logging: {
        compressedSizes: boolean;
        buildSuccess: boolean;
    };
    baseURL: string;
    apiBaseURL: string;
    handlers: NitroEventHandler[];
    routeRules: {
        [path: string]: NitroRouteRules;
    };
    devHandlers: NitroDevEventHandler[];
    errorHandler: string;
    devErrorHandler: NitroErrorHandler;
    prerender: {
        /**
         * Prerender HTML routes within subfolders (`/test` would produce `/test/index.html`)
         */
        autoSubfolderIndex: boolean;
        concurrency: number;
        interval: number;
        crawlLinks: boolean;
        failOnError: boolean;
        ignore: Array<string | RegExp | ((path: string) => undefined | null | boolean)>;
        routes: string[];
        /**
         * Amount of retries. Pass Infinity to retry indefinitely.
         * @default 3
         */
        retry: number;
        /**
         * Delay between each retry in ms.
         * @default 500
         */
        retryDelay: number;
    };
    rollupConfig?: RollupConfig;
    entry: string;
    unenv: Preset;
    alias: Record<string, string>;
    minify: boolean;
    inlineDynamicImports: boolean;
    sourceMap: boolean | "inline" | "hidden";
    node: boolean;
    moduleSideEffects: string[];
    esbuild?: {
        options?: Partial<EsbuildOptions>;
    };
    noExternals: boolean;
    externals: NodeExternalsOptions;
    analyze: false | PluginVisualizerOptions;
    replace: Record<string, string | ((id: string) => string)>;
    commonJS?: RollupCommonJSOptions;
    exportConditions?: string[];
    typescript: {
        strict?: boolean;
        internalPaths?: boolean;
        generateRuntimeConfigTypes?: boolean;
        generateTsConfig?: boolean;
        /** the path of the generated `tsconfig.json`, relative to buildDir */
        tsconfigPath: string;
        tsConfig?: Partial<TSConfig>;
    };
    hooks: NestedHooks<NitroHooks>;
    nodeModulesDirs: string[];
    commands: {
        preview: string;
        deploy: string;
    };
    framework: NitroFrameworkInfo;
    iis?: {
        mergeConfig?: boolean;
        overrideConfig?: boolean;
    };
}
/**
 * Nitro input config (nitro.config)
 */
interface NitroConfig extends DeepPartial<Omit<NitroOptions, "routeRules" | "rollupConfig" | "preset" | "compatibilityDate">>, C12InputConfig<NitroConfig> {
    preset?: PresetNameInput;
    extends?: string | string[] | NitroPreset;
    routeRules?: {
        [path: string]: NitroRouteConfig;
    };
    rollupConfig?: Partial<RollupConfig>;
    compatibilityDate?: CompatibilityDateSpec;
}
interface LoadConfigOptions {
    watch?: boolean;
    c12?: WatchConfigOptions;
    compatibilityDate?: CompatibilityDateSpec;
}
interface AppConfig {
    [key: string]: any;
}
interface PublicAssetDir {
    baseURL?: string;
    fallthrough?: boolean;
    maxAge: number;
    dir: string;
}
interface CompressOptions {
    gzip?: boolean;
    brotli?: boolean;
}
interface ServerAssetDir {
    baseName: string;
    dir: string;
    ignore?: string[];
}
type CustomDriverName = string & {
    _custom?: any;
};
interface StorageMounts {
    [path: string]: {
        driver: BuiltinDriverName | CustomDriverName;
        [option: string]: any;
    };
}
type DatabaseConnectionName = "default" | (string & {});
type DatabaseConnectionConfig = {
    connector: ConnectorName;
    options?: {
        [key: string]: any;
    };
};
type DatabaseConnectionConfigs = Record<DatabaseConnectionName, DatabaseConnectionConfig>;
interface NitroRuntimeConfigApp extends NitroRuntimeConfigApp$1 {
}
interface NitroRuntimeConfig extends NitroRuntimeConfig$1 {
}

interface Nitro {
    options: NitroOptions;
    scannedHandlers: NitroEventHandler[];
    vfs: Record<string, string>;
    hooks: Hookable<NitroHooks>;
    unimport?: Unimport;
    logger: ConsolaInstance;
    storage: Storage;
    close: () => Promise<void>;
    updateConfig: (config: NitroDynamicConfig) => void | Promise<void>;
    _prerenderedRoutes?: PrerenderRoute[];
    _prerenderMeta?: Record<string, {
        contentType?: string;
    }>;
}
type NitroDynamicConfig = Pick<NitroConfig, "runtimeConfig" | "routeRules">;
type NitroTypes = {
    routes: Record<string, Partial<Record<RouterMethod | "default", string[]>>>;
};
interface NitroFrameworkInfo {
    name?: "nitro" | (string & {});
    version?: string;
}
/** Build info written to `.output/nitro.json` or `.nitro/dev/nitro.json` */
interface NitroBuildInfo {
    date: string;
    preset: PresetName;
    framework: NitroFrameworkInfo;
    versions: {
        nitro: string;
        [key: string]: string;
    };
    commands?: {
        preview?: string;
        deploy?: string;
    };
    dev?: {
        pid: number;
        workerAddress: {
            host: string;
            port: number;
            socketPath?: string;
        };
    };
    config?: Partial<PresetOptions>;
}

type NitroModuleInput = string | NitroModule | NitroModule["setup"];
interface NitroModule {
    name?: string;
    setup: (this: void, nitro: Nitro) => void | Promise<void>;
}

export type { AppConfig as A, PrerenderGenerateRoute as B, CacheEntry as C, DatabaseConnectionName as D, NitroPreset as E, NitroPresetMeta as F, RollupConfig as G, RollupVirtualOptions as H, EsbuildOptions as I, NodeExternalsOptions as J, ServerAssetOptions as K, LoadConfigOptions as L, RawOptions as M, NitroModule as N, HTTPStatusCode as O, PublicAssetDir as P, NitroRouteConfig as Q, ResponseCacheEntry as R, ServerAssetDir as S, NitroRouteRules as T, VirtualModule as V, NitroConfig as a, NitroOptions as b, CacheOptions as c, CachedEventHandlerOptions as d, CompressOptions as e, StorageMounts as f, DatabaseConnectionConfig as g, DatabaseConnectionConfigs as h, NitroRuntimeConfigApp as i, NitroRuntimeConfig as j, NitroOpenAPIConfig as k, DevServerOptions as l, NitroWorker as m, NitroDevServer as n, NitroRouteMeta as o, NitroEventHandler as p, NitroDevEventHandler as q, NitroErrorHandler as r, NitroHooks as s, NitroModuleInput as t, Nitro as u, NitroDynamicConfig as v, NitroTypes as w, NitroFrameworkInfo as x, NitroBuildInfo as y, PrerenderRoute as z };
