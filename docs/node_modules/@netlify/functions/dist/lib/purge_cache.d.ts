interface BasePurgeCacheOptions {
    apiURL?: string;
    deployAlias?: string;
    tags?: string[];
    token?: string;
    userAgent?: string;
}
interface PurgeCacheOptionsWithSiteID extends BasePurgeCacheOptions {
    siteID?: string;
}
interface PurgeCacheOptionsWithSiteSlug extends BasePurgeCacheOptions {
    siteSlug: string;
}
interface PurgeCacheOptionsWithDomain extends BasePurgeCacheOptions {
    domain: string;
}
type PurgeCacheOptions = PurgeCacheOptionsWithSiteID | PurgeCacheOptionsWithSiteSlug | PurgeCacheOptionsWithDomain;
declare const purgeCache: (options?: PurgeCacheOptions) => Promise<void>;

export { purgeCache };
