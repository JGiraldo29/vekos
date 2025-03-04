import { existsSync, promises as fsp } from "node:fs";
import { parseTOML, stringifyTOML } from "confbox";
import defu from "defu";
import { globby } from "globby";
import { join, resolve } from "pathe";
import { isCI } from "std-env";
import {
  joinURL,
  hasProtocol,
  withLeadingSlash,
  withTrailingSlash,
  withoutLeadingSlash
} from "ufo";
export async function writeCFPagesFiles(nitro) {
  await writeCFRoutes(nitro);
  await writeCFPagesHeaders(nitro);
  await writeCFPagesRedirects(nitro);
  await writeCFWrangler(nitro);
}
export async function writeCFPagesStaticFiles(nitro) {
  await writeCFPagesHeaders(nitro);
  await writeCFPagesRedirects(nitro);
}
async function writeCFRoutes(nitro) {
  const _cfPagesConfig = nitro.options.cloudflare?.pages || {};
  const routes = {
    version: _cfPagesConfig.routes?.version || 1,
    include: _cfPagesConfig.routes?.include || ["/*"],
    exclude: _cfPagesConfig.routes?.exclude || []
  };
  const writeRoutes = () => fsp.writeFile(
    resolve(nitro.options.output.dir, "_routes.json"),
    JSON.stringify(routes, void 0, 2)
  );
  if (_cfPagesConfig.defaultRoutes === false) {
    await writeRoutes();
    return;
  }
  const explicitPublicAssets = nitro.options.publicAssets.filter(
    (dir, index, array) => {
      if (dir.fallthrough || !dir.baseURL) {
        return false;
      }
      const normalizedBase = withoutLeadingSlash(dir.baseURL);
      return !array.some(
        (otherDir, otherIndex) => otherIndex !== index && normalizedBase.startsWith(
          withoutLeadingSlash(withTrailingSlash(otherDir.baseURL))
        )
      );
    }
  );
  routes.exclude.push(
    ...explicitPublicAssets.map((asset) => joinURL(nitro.options.baseURL, asset.baseURL || "/", "*")).sort(comparePaths)
  );
  const publicAssetFiles = await globby("**", {
    cwd: nitro.options.output.dir,
    absolute: false,
    dot: true,
    ignore: [
      "_worker.js",
      "_worker.js.map",
      "nitro.json",
      ...routes.exclude.map(
        (path) => withoutLeadingSlash(path.replace(/\/\*$/, "/**"))
      )
    ]
  });
  routes.exclude.push(
    ...publicAssetFiles.map(
      (i) => withLeadingSlash(i).replace(/\/index\.html$/, "").replace(/\.html$/, "") || "/"
    ).sort(comparePaths)
  );
  routes.exclude.splice(100 - routes.include.length);
  await writeRoutes();
}
function comparePaths(a, b) {
  return a.split("/").length - b.split("/").length || a.localeCompare(b);
}
async function writeCFPagesHeaders(nitro) {
  const headersPath = join(nitro.options.output.dir, "_headers");
  const contents = [];
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => b[0].split(/\/(?!\*)/).length - a[0].split(/\/(?!\*)/).length
  );
  for (const [path, routeRules] of rules.filter(
    ([_, routeRules2]) => routeRules2.headers
  )) {
    const headers = [
      joinURL(nitro.options.baseURL, path.replace("/**", "/*")),
      ...Object.entries({ ...routeRules.headers }).map(
        ([header, value]) => `  ${header}: ${value}`
      )
    ].join("\n");
    contents.push(headers);
  }
  if (existsSync(headersPath)) {
    const currentHeaders = await fsp.readFile(headersPath, "utf8");
    if (/^\/\* /m.test(currentHeaders)) {
      nitro.logger.info(
        "Not adding Nitro fallback to `_headers` (as an existing fallback was found)."
      );
      return;
    }
    nitro.logger.info(
      "Adding Nitro fallback to `_headers` to handle all unmatched routes."
    );
    contents.unshift(currentHeaders);
  }
  await fsp.writeFile(headersPath, contents.join("\n"));
}
async function writeCFPagesRedirects(nitro) {
  const redirectsPath = join(nitro.options.output.dir, "_redirects");
  const staticFallback = existsSync(
    join(nitro.options.output.publicDir, "404.html")
  ) ? `${joinURL(nitro.options.baseURL, "/*")} ${joinURL(nitro.options.baseURL, "/404.html")} 404` : "";
  const contents = [staticFallback];
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => a[0].split(/\/(?!\*)/).length - b[0].split(/\/(?!\*)/).length
  );
  for (const [key, routeRules] of rules.filter(
    ([_, routeRules2]) => routeRules2.redirect
  )) {
    const code = routeRules.redirect.statusCode;
    const from = joinURL(nitro.options.baseURL, key.replace("/**", "/*"));
    const to = hasProtocol(routeRules.redirect.to, { acceptRelative: true }) ? routeRules.redirect.to : joinURL(nitro.options.baseURL, routeRules.redirect.to);
    contents.unshift(`${from}	${to}	${code}`);
  }
  if (existsSync(redirectsPath)) {
    const currentRedirects = await fsp.readFile(redirectsPath, "utf8");
    if (/^\/\* /m.test(currentRedirects)) {
      nitro.logger.info(
        "Not adding Nitro fallback to `_redirects` (as an existing fallback was found)."
      );
      return;
    }
    nitro.logger.info(
      "Adding Nitro fallback to `_redirects` to handle all unmatched routes."
    );
    contents.unshift(currentRedirects);
  }
  await fsp.writeFile(redirectsPath, contents.join("\n"));
}
async function writeCFWrangler(nitro) {
  const inlineConfig = nitro.options.cloudflare?.wrangler || {};
  if (!inlineConfig || Object.keys(inlineConfig).length === 0) {
    return;
  }
  let configFromFile = {};
  const configPath = resolve(
    nitro.options.rootDir,
    inlineConfig.configPath || "wrangler.toml"
  );
  if (existsSync(configPath)) {
    configFromFile = parseTOML(
      await fsp.readFile(configPath, "utf8")
    );
  }
  const wranglerConfig = defu(configFromFile, inlineConfig);
  const wranglerPath = join(
    isCI ? nitro.options.rootDir : nitro.options.buildDir,
    "wrangler.toml"
  );
  await fsp.writeFile(wranglerPath, stringifyTOML(wranglerConfig));
}
