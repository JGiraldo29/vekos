interface PackageManifest {
    name: string;
    distTags: Record<string, string> & {
        latest: string;
    };
    versions: string[];
    time: Record<string, string> & {
        created: string;
        modified: string;
    };
    lastSynced: number;
}
interface PackageVersionsInfo extends PackageManifest {
    specifier: string;
}
interface ResolvedPackageVersion {
    name: string;
    version: string | null;
    specifier: string;
    publishedAt: string | null;
    lastSynced: number;
}

interface FetchOptions {
    apiEndpoint?: string;
    /**
     * Fetch function
     */
    fetch?: typeof fetch;
}
interface GetVersionsOptions extends FetchOptions {
    /**
     * By pass cache and get the latest data
     */
    force?: boolean;
    /**
     * Include all versions that are newer than the specified version
     */
    loose?: boolean;
}
interface GetLatestVersionOptions extends FetchOptions {
    /**
     * By pass cache and get the latest data
     */
    force?: boolean;
}
declare const defaultOptions: {
    /**
     * API endpoint for fetching package versions
     *
     * @default 'https://npm.antfu.dev/'
     */
    apiEndpoint: string;
};
declare function getLatestVersionBatch(packages: string[], options?: GetLatestVersionOptions): Promise<ResolvedPackageVersion[]>;
declare function getLatestVersion(name: string, options?: GetLatestVersionOptions): Promise<ResolvedPackageVersion>;
declare function getVersionsBatch(packages: string[], options?: GetVersionsOptions): Promise<PackageVersionsInfo[]>;
declare function getVersions(name: string, options?: GetVersionsOptions): Promise<PackageVersionsInfo>;

declare const NPM_REGISTRY = "https://registry.npmjs.org/";
/**
 * Lightweight replacement of `npm-registry-fetch` function `pickRegistry`'
 *
 * @param scope - scope of package, get from 'npm-package-arg'
 * @param npmConfigs - npm configs, read from `.npmrc` file
 * @param defaultRegistry - default registry, default to 'https://registry.npmjs.org/'
 */
declare function pickRegistry(scope: string | null | undefined, npmConfigs: Record<string, unknown>, defaultRegistry?: string): string;

export { type FetchOptions, type GetLatestVersionOptions, type GetVersionsOptions, NPM_REGISTRY, type PackageManifest, type ResolvedPackageVersion, defaultOptions, getLatestVersion, getLatestVersionBatch, getVersions, getVersionsBatch, pickRegistry };
