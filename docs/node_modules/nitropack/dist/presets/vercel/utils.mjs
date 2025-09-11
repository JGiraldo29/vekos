import fsp from "node:fs/promises";
import { defu } from "defu";
import { writeFile } from "nitropack/kit";
import { dirname, relative, resolve } from "pathe";
import { joinURL, withoutLeadingSlash } from "ufo";
import { isTest } from "std-env";
export async function generateFunctionFiles(nitro) {
  const buildConfigPath = resolve(nitro.options.output.dir, "config.json");
  const buildConfig = generateBuildConfig(nitro);
  await writeFile(buildConfigPath, JSON.stringify(buildConfig, null, 2));
  const systemNodeVersion = process.versions.node.split(".")[0];
  const runtimeVersion = `nodejs${systemNodeVersion}.x`;
  const functionConfigPath = resolve(
    nitro.options.output.serverDir,
    ".vc-config.json"
  );
  const functionConfig = {
    runtime: runtimeVersion,
    handler: "index.mjs",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
    supportsResponseStreaming: true,
    ...nitro.options.vercel?.functions
  };
  await writeFile(functionConfigPath, JSON.stringify(functionConfig, null, 2));
  for (const [key, value] of Object.entries(nitro.options.routeRules)) {
    if (!value.isr) {
      continue;
    }
    let isrConfig = value.isr;
    if (typeof isrConfig === "number") {
      isrConfig = { expiration: isrConfig };
    } else if (isrConfig === true) {
      isrConfig = { expiration: false };
    } else {
      isrConfig = { ...isrConfig };
    }
    const prerenderConfig = {
      expiration: isrConfig.expiration ?? false,
      bypassToken: nitro.options.vercel?.config?.bypassToken,
      ...isrConfig
    };
    if (key.includes("/**")) {
      isrConfig.allowQuery = isrConfig.allowQuery || [];
      if (!isrConfig.allowQuery.includes("url")) {
        isrConfig.allowQuery.push("url");
      }
    }
    const funcPrefix = resolve(
      nitro.options.output.serverDir,
      ".." + generateEndpoint(key)
    );
    await fsp.mkdir(dirname(funcPrefix), { recursive: true });
    await fsp.symlink(
      "./" + relative(dirname(funcPrefix), nitro.options.output.serverDir),
      funcPrefix + ".func",
      "junction"
    );
    await writeFile(
      funcPrefix + ".prerender-config.json",
      JSON.stringify(prerenderConfig, null, 2)
    );
  }
}
export async function generateEdgeFunctionFiles(nitro) {
  const buildConfigPath = resolve(nitro.options.output.dir, "config.json");
  const buildConfig = generateBuildConfig(nitro);
  await writeFile(buildConfigPath, JSON.stringify(buildConfig, null, 2));
  const functionConfigPath = resolve(
    nitro.options.output.serverDir,
    ".vc-config.json"
  );
  const functionConfig = {
    runtime: "edge",
    entrypoint: "index.mjs",
    regions: nitro.options.vercel?.regions
  };
  await writeFile(functionConfigPath, JSON.stringify(functionConfig, null, 2));
}
export async function generateStaticFiles(nitro) {
  const buildConfigPath = resolve(nitro.options.output.dir, "config.json");
  const buildConfig = generateBuildConfig(nitro);
  await writeFile(buildConfigPath, JSON.stringify(buildConfig, null, 2));
}
function generateBuildConfig(nitro) {
  const rules = Object.entries(nitro.options.routeRules).sort(
    (a, b) => b[0].split(/\/(?!\*)/).length - a[0].split(/\/(?!\*)/).length
  );
  const config = defu(nitro.options.vercel?.config, {
    version: 3,
    overrides: {
      // Nitro static prerendered route overrides
      ...Object.fromEntries(
        (nitro._prerenderedRoutes?.filter((r) => r.fileName !== r.route) || []).map(({ route, fileName }) => [
          withoutLeadingSlash(fileName),
          { path: route.replace(/^\//, "") }
        ])
      )
    },
    routes: [
      // Redirect and header rules
      ...rules.filter(([_, routeRules]) => routeRules.redirect || routeRules.headers).map(([path, routeRules]) => {
        let route = {
          src: path.replace("/**", "/(.*)")
        };
        if (routeRules.redirect) {
          route = defu(route, {
            status: routeRules.redirect.statusCode,
            headers: {
              Location: routeRules.redirect.to.replace("/**", "/$1")
            }
          });
        }
        if (routeRules.headers) {
          route = defu(route, { headers: routeRules.headers });
        }
        return route;
      }),
      // Public asset rules
      ...nitro.options.publicAssets.filter((asset) => !asset.fallthrough).map((asset) => joinURL(nitro.options.baseURL, asset.baseURL || "/")).map((baseURL) => ({
        src: baseURL + "(.*)",
        headers: {
          "cache-control": "public,max-age=31536000,immutable"
        },
        continue: true
      })),
      { handle: "filesystem" }
    ]
  });
  if (nitro.options.static) {
    return config;
  }
  config.routes.push(
    ...rules.filter(
      ([key, value]) => (
        // value.isr === false || (value.isr && key.includes("/**"))
        value.isr !== void 0 && key !== "/"
      )
    ).map(([key, value]) => {
      const src = key.replace(/^(.*)\/\*\*/, "(?<url>$1/.*)");
      if (value.isr === false) {
        return {
          src,
          dest: "/__nitro"
        };
      }
      return {
        src,
        dest: nitro.options.preset === "vercel-edge" ? "/__nitro?url=$url" : generateEndpoint(key) + "?url=$url"
      };
    }),
    ...nitro.options.routeRules["/"]?.isr ? [
      {
        src: "(?<url>/)",
        dest: "/__nitro-index?url=$url"
      }
    ] : [],
    ...nitro.options.routeRules["/**"]?.isr ? [] : [
      {
        src: "/(.*)",
        dest: "/__nitro"
      }
    ]
  );
  return config;
}
function generateEndpoint(url) {
  if (url === "/") {
    return "/__nitro-index";
  }
  return url.includes("/**") ? "/__nitro-" + withoutLeadingSlash(url.replace(/\/\*\*.*/, "").replace(/[^a-z]/g, "-")) : url;
}
export function deprecateSWR(nitro) {
  if (nitro.options.future.nativeSWR) {
    return;
  }
  let hasLegacyOptions = false;
  for (const [key, value] of Object.entries(nitro.options.routeRules)) {
    if (_hasProp(value, "isr")) {
      continue;
    }
    if (value.cache === false) {
      value.isr = false;
    }
    if (_hasProp(value, "static")) {
      value.isr = !value.static;
      hasLegacyOptions = true;
    }
    if (value.cache && _hasProp(value.cache, "swr")) {
      value.isr = value.cache.swr;
      hasLegacyOptions = true;
    }
  }
  if (hasLegacyOptions && !isTest) {
    nitro.logger.warn(
      "Nitro now uses `isr` option to configure ISR behavior on Vercel. Backwards-compatible support for `static` and `swr` options within the Vercel Build Options API will be removed in the future versions. Set `future.nativeSWR: true` nitro config disable this warning."
    );
  }
}
function _hasProp(obj, prop) {
  return obj && typeof obj === "object" && prop in obj;
}
