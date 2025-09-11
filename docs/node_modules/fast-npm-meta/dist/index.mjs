const defaultOptions = {
  /**
   * API endpoint for fetching package versions
   *
   * @default 'https://npm.antfu.dev/'
   */
  apiEndpoint: "https://npm.antfu.dev/"
};
async function getLatestVersionBatch(packages, options = {}) {
  const {
    apiEndpoint = defaultOptions.apiEndpoint,
    fetch: fetchApi = fetch
  } = options;
  const query = options.force ? "?force=true" : "";
  const data = await fetchApi(new URL(packages.join("+") + query, apiEndpoint)).then((r) => r.json());
  if (!Array.isArray(data))
    return [data];
  return data;
}
async function getLatestVersion(name, options = {}) {
  const [data] = await getLatestVersionBatch([name], options);
  return data;
}
async function getVersionsBatch(packages, options = {}) {
  const {
    apiEndpoint = defaultOptions.apiEndpoint,
    fetch: fetchApi = fetch
  } = options;
  let query = [
    options.force ? "force=true" : "",
    options.loose ? "loose=true" : ""
  ].filter(Boolean).join("&");
  if (query)
    query = `?${query}`;
  const data = await fetchApi(new URL(`/versions/${packages.join("+")}${query}`, apiEndpoint)).then((r) => r.json());
  if (!Array.isArray(data))
    return [data];
  return data;
}
async function getVersions(name, options = {}) {
  const [data] = await getVersionsBatch([name], options);
  return data;
}

const NPM_REGISTRY = "https://registry.npmjs.org/";
function pickRegistry(scope, npmConfigs, defaultRegistry = NPM_REGISTRY) {
  let registry = scope ? npmConfigs[`${scope.replace(/^@?/, "@")}:registry`] : void 0;
  if (!registry && typeof npmConfigs.scope === "string") {
    registry = npmConfigs[`${npmConfigs.scope.replace(/^@?/, "@")}:registry`];
  }
  if (!registry) {
    registry = npmConfigs.registry || defaultRegistry;
  }
  return registry;
}

export { NPM_REGISTRY, defaultOptions, getLatestVersion, getLatestVersionBatch, getVersions, getVersionsBatch, pickRegistry };
