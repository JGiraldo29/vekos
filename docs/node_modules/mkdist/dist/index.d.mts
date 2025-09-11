import { TSConfig } from 'pkg-types';
import { CommonOptions } from 'esbuild';
import { AcceptedPlugin, ProcessOptions } from 'postcss';
import { Options } from 'postcss-nested';
import { Options as Options$1 } from 'autoprefixer';
import { Options as Options$2 } from 'cssnano';

declare const loaders: {
    js: Loader;
    vue: Loader;
    sass: Loader;
    postcss: Loader;
};
type LoaderName = keyof typeof loaders;

interface InputFile {
    path: string;
    extension: string;
    srcPath?: string;
    getContents: () => Promise<string> | string;
}
interface OutputFile {
    /**
     * relative to distDir
     */
    path: string;
    srcPath?: string;
    extension?: string;
    contents?: string;
    declaration?: boolean;
    raw?: boolean;
    skip?: boolean;
}
type LoaderResult = OutputFile[] | undefined;
type LoadFile = (input: InputFile) => LoaderResult | Promise<LoaderResult>;
interface LoaderOptions {
    ext?: "js" | "mjs" | "cjs" | "ts" | "mts" | "cts";
    format?: "cjs" | "esm";
    declaration?: boolean;
    esbuild?: CommonOptions;
    postcss?: false | {
        nested?: false | Options;
        autoprefixer?: false | Options$1;
        cssnano?: false | Options$2;
        plugins?: AcceptedPlugin[];
        processOptions?: Omit<ProcessOptions, "from">;
    };
}
interface LoaderContext {
    loadFile: LoadFile;
    options: LoaderOptions;
}
type Loader = (input: InputFile, context: LoaderContext) => LoaderResult | Promise<LoaderResult>;

interface MkdistOptions extends LoaderOptions {
    rootDir?: string;
    srcDir?: string;
    pattern?: string | string[];
    distDir?: string;
    cleanDist?: boolean;
    loaders?: (LoaderName | Loader)[];
    addRelativeDeclarationExtensions?: boolean;
    typescript?: {
        compilerOptions?: TSConfig["compilerOptions"];
    };
}
declare function mkdist(options?: MkdistOptions): Promise<{
    writtenFiles: string[];
}>;

export { type MkdistOptions, mkdist };
