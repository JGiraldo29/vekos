import { PackageJson } from 'pkg-types';
import { Hookable } from 'hookable';
import { RollupOptions, RollupBuild } from 'rollup';
import { MkdistOptions } from 'mkdist';
import { Schema } from 'untyped';
import { RollupReplaceOptions } from '@rollup/plugin-replace';
import { RollupAliasOptions } from '@rollup/plugin-alias';
import { RollupNodeResolveOptions } from '@rollup/plugin-node-resolve';
import { RollupJsonOptions } from '@rollup/plugin-json';
import { Options as Options$1 } from 'rollup-plugin-dts';
import commonjs from '@rollup/plugin-commonjs';
import { CommonOptions, Loader } from 'esbuild';
import { FilterPattern } from '@rollup/pluginutils';

interface Options extends CommonOptions {
    /** alias to `sourcemap` */
    sourceMap?: boolean;
    include?: FilterPattern;
    exclude?: FilterPattern;
    /**
     * Use this tsconfig file instead
     * Disable it by setting to `false`
     */
    tsconfig?: string | false;
    /**
     * Map extension to esbuild loader
     * Note that each entry (the extension) needs to start with a dot
     */
    loaders?: {
        [ext: string]: Loader | false;
    };
}

type RollupCommonJSOptions = Parameters<typeof commonjs>[0] & {};
interface BaseBuildEntry {
    builder?: "untyped" | "rollup" | "mkdist";
    input: string;
    name?: string;
    outDir?: string;
    declaration?: boolean;
}
interface UntypedBuildEntry extends BaseBuildEntry {
    builder: "untyped";
    defaults?: Record<string, any>;
}
interface RollupBuildEntry extends BaseBuildEntry {
    builder: "rollup";
}
interface MkdistBuildEntry extends BaseBuildEntry {
    builder: "mkdist";
    format?: "esm" | "cjs";
    ext?: "cjs" | "mjs" | "js" | "ts";
    pattern?: string | string[];
}
type BuildEntry = BaseBuildEntry | RollupBuildEntry | UntypedBuildEntry | MkdistBuildEntry;
interface RollupBuildOptions {
    emitCJS?: boolean;
    cjsBridge?: boolean;
    inlineDependencies?: boolean;
    replace: RollupReplaceOptions | false;
    alias: RollupAliasOptions | false;
    resolve: RollupNodeResolveOptions | false;
    json: RollupJsonOptions | false;
    esbuild: Options | false;
    commonjs: RollupCommonJSOptions | false;
    dts: Options$1;
}
interface BuildOptions {
    name: string;
    rootDir: string;
    entries: BuildEntry[];
    clean: boolean;
    declaration?: boolean;
    outDir: string;
    stub: boolean;
    externals: (string | RegExp)[];
    dependencies: string[];
    peerDependencies: string[];
    devDependencies: string[];
    alias: {
        [find: string]: string;
    };
    replace: {
        [find: string]: string;
    };
    failOnWarn?: boolean;
    rollup: RollupBuildOptions;
}
interface BuildContext {
    options: BuildOptions;
    pkg: PackageJson;
    buildEntries: {
        path: string;
        bytes?: number;
        exports?: string[];
        chunks?: string[];
        chunk?: boolean;
        modules?: {
            id: string;
            bytes: number;
        }[];
    }[];
    usedImports: Set<string>;
    warnings: Set<string>;
    hooks: Hookable<BuildHooks>;
}
type BuildPreset = BuildConfig | (() => BuildConfig);
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
interface BuildConfig extends DeepPartial<Omit<BuildOptions, "entries">> {
    entries?: (BuildEntry | string)[];
    preset?: string | BuildPreset;
    hooks?: Partial<BuildHooks>;
}
interface UntypedOutput {
    fileName: string;
    contents: string;
}
interface UntypedOutputs {
    markdown: UntypedOutput;
    schema: UntypedOutput;
    defaults: UntypedOutput;
    declaration?: UntypedOutput;
}
interface BuildHooks {
    "build:prepare": (ctx: BuildContext) => void | Promise<void>;
    "build:before": (ctx: BuildContext) => void | Promise<void>;
    "build:done": (ctx: BuildContext) => void | Promise<void>;
    "rollup:options": (ctx: BuildContext, options: RollupOptions) => void | Promise<void>;
    "rollup:build": (ctx: BuildContext, build: RollupBuild) => void | Promise<void>;
    "rollup:dts:options": (ctx: BuildContext, options: RollupOptions) => void | Promise<void>;
    "rollup:dts:build": (ctx: BuildContext, build: RollupBuild) => void | Promise<void>;
    "rollup:done": (ctx: BuildContext) => void | Promise<void>;
    "mkdist:entries": (ctx: BuildContext, entries: MkdistBuildEntry[]) => void | Promise<void>;
    "mkdist:entry:options": (ctx: BuildContext, entry: MkdistBuildEntry, options: MkdistOptions) => void | Promise<void>;
    "mkdist:entry:build": (ctx: BuildContext, entry: MkdistBuildEntry, output: {
        writtenFiles: string[];
    }) => void | Promise<void>;
    "mkdist:done": (ctx: BuildContext) => void | Promise<void>;
    "untyped:entries": (ctx: BuildContext, entries: UntypedBuildEntry[]) => void | Promise<void>;
    "untyped:entry:options": (ctx: BuildContext, entry: UntypedBuildEntry, options: any) => void | Promise<void>;
    "untyped:entry:schema": (ctx: BuildContext, entry: UntypedBuildEntry, schema: Schema) => void | Promise<void>;
    "untyped:entry:outputs": (ctx: BuildContext, entry: UntypedBuildEntry, outputs: UntypedOutputs) => void | Promise<void>;
    "untyped:done": (ctx: BuildContext) => void | Promise<void>;
}
declare function defineBuildConfig(config: BuildConfig): BuildConfig;
declare function definePreset(preset: BuildPreset): BuildPreset;

declare function build(rootDir: string, stub: boolean, inputConfig?: BuildConfig): Promise<void>;

export { BaseBuildEntry, BuildConfig, BuildContext, BuildEntry, BuildHooks, BuildOptions, BuildPreset, MkdistBuildEntry, RollupBuildEntry, RollupBuildOptions, RollupCommonJSOptions, UntypedBuildEntry, UntypedOutput, UntypedOutputs, build, defineBuildConfig, definePreset };
