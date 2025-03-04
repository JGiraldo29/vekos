import * as unplugin from 'unplugin';

interface ImpoundOptions {
    /** An array of patterns of importers to apply the import protection rules to. */
    include?: Array<string | RegExp>;
    /** An array of patterns of importers where the import protection rules explicitly do not apply. */
    exclude?: Array<string | RegExp>;
    cwd?: string;
    /** Whether to throw an error or not. if set to `false`, an error will be logged to console instead. */
    error?: boolean;
    /** An array of patterns to prevent being imported, along with an optional warning to display.  */
    patterns: [importPattern: string | RegExp, warning?: string][];
}
declare const ImpoundPlugin: unplugin.UnpluginInstance<ImpoundOptions, boolean>;

export { type ImpoundOptions, ImpoundPlugin };
