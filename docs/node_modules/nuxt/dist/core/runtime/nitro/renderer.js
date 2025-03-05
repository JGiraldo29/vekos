import { AsyncLocalStorage } from "node:async_hooks";
import {
  createRenderer,
  getPrefetchLinks,
  getPreloadLinks,
  getRequestDependencies,
  renderResourceHeaders
} from "vue-bundle-renderer/runtime";
import { appendResponseHeader, createError, getQuery, getResponseStatus, getResponseStatusText, readBody, writeEarlyHints } from "h3";
import devalue from "@nuxt/devalue";
import { stringify, uneval } from "devalue";
import destr from "destr";
import { getQuery as getURLQuery, joinURL, withoutTrailingSlash } from "ufo";
import { renderToString as _renderToString } from "vue/server-renderer";
import { propsToString, renderSSRHead } from "@unhead/ssr";
import { createServerHead, resolveUnrefHeadInput } from "@unhead/vue";
import { defineRenderHandler, getRouteRules, useRuntimeConfig, useStorage } from "#internal/nitro";
import { useNitroApp } from "#internal/nitro/app";
import unheadPlugins from "#internal/unhead-plugins.mjs";
import { renderSSRHeadOptions } from "#internal/unhead.config.mjs";
import { appHead, appId, appRootAttrs, appRootTag, appSpaLoaderAttrs, appSpaLoaderTag, appTeleportAttrs, appTeleportTag, componentIslands, appManifest as isAppManifestEnabled, multiApp, spaLoadingTemplateOutside } from "#internal/nuxt.config.mjs";
import { buildAssetsURL, publicAssetsURL } from "#internal/nuxt/paths";
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
if (process.env.NUXT_ASYNC_CONTEXT && !("AsyncLocalStorage" in globalThis)) {
  globalThis.AsyncLocalStorage = AsyncLocalStorage;
}
const getClientManifest = () => import("#build/dist/server/client.manifest.mjs").then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getEntryIds = () => getClientManifest().then((r) => Object.values(r).filter(
  (r2) => (
    // @ts-expect-error internal key set by CSS inlining configuration
    r2._globalCSS
  )
).map((r2) => r2.src));
const getServerEntry = () => import("#build/dist/server/server.mjs").then((r) => r.default || r);
const getSSRStyles = lazyCachedFunction(() => import("#build/dist/server/styles.mjs").then((r) => r.default || r));
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString(input, context) {
    const html = await _renderToString(input, context);
    if (import.meta.dev && process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await import("#spa-template").then((r) => r.template).catch(() => "").then((r) => {
    if (spaLoadingTemplateOutside) {
      const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
      const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
      const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
      const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
      return appTemplate + loaderTemplate;
    } else {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules = ssrContext.modules || /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
const payloadCache = import.meta.prerender ? useStorage("internal:nuxt:prerender:payload") : null;
const islandCache = import.meta.prerender ? useStorage("internal:nuxt:prerender:island") : null;
const islandPropCache = import.meta.prerender ? useStorage("internal:nuxt:prerender:island-props") : null;
const sharedPrerenderPromises = import.meta.prerender && process.env.NUXT_SHARED_DATA ? /* @__PURE__ */ new Map() : null;
const sharedPrerenderKeys = /* @__PURE__ */ new Set();
const sharedPrerenderCache = import.meta.prerender && process.env.NUXT_SHARED_DATA ? {
  get(key) {
    if (sharedPrerenderKeys.has(key)) {
      return sharedPrerenderPromises.get(key) ?? useStorage("internal:nuxt:prerender:shared").getItem(key);
    }
  },
  async set(key, value) {
    sharedPrerenderKeys.add(key);
    sharedPrerenderPromises.set(key, value);
    useStorage("internal:nuxt:prerender:shared").setItem(key, await value).finally(() => sharedPrerenderPromises.delete(key));
  }
} : null;
const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
async function getIslandContext(event) {
  let url = event.path || "";
  if (import.meta.prerender && event.path && await islandPropCache.hasItem(event.path)) {
    url = await islandPropCache.getItem(event.path);
  }
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}
const HAS_APP_TELEPORTS = !!(appTeleportTag && appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const PAYLOAD_URL_RE = process.env.NUXT_JSON_PAYLOADS ? /\/_payload.json(\?.*)?$/ : /\/_payload.js(\?.*)?$/;
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
const PRERENDER_NO_SSR_ROUTES = /* @__PURE__ */ new Set(["/index.html", "/200.html", "/404.html"]);
export default defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery(event) : null;
  if (ssrError && ssrError.statusCode) {
    ssrError.statusCode = Number.parseInt(ssrError.statusCode);
  }
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const isRenderingIsland = componentIslands && event.path.startsWith("/__nuxt_island");
  const islandContext = isRenderingIsland ? await getIslandContext(event) : void 0;
  if (import.meta.prerender && islandContext && event.path && await islandCache.hasItem(event.path)) {
    return islandCache.getItem(event.path);
  }
  let url = ssrError?.url || islandContext?.url || event.path;
  const isRenderingPayload = PAYLOAD_URL_RE.test(url) && !isRenderingIsland;
  if (isRenderingPayload) {
    url = url.substring(0, url.lastIndexOf("/")) || "/";
    event._path = url;
    event.node.req.url = url;
    if (import.meta.prerender && await payloadCache.hasItem(url)) {
      return payloadCache.getItem(url);
    }
  }
  const routeOptions = getRouteRules(event);
  const head = createServerHead({
    plugins: unheadPlugins
  });
  const headEntryOptions = { mode: "server" };
  if (!isRenderingIsland) {
    head.push(appHead, headEntryOptions);
  }
  const ssrContext = {
    url,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: !!process.env.NUXT_NO_SSR || event.context.nuxt?.noSSR || routeOptions.ssr === false && !isRenderingIsland || (import.meta.prerender ? PRERENDER_NO_SSR_ROUTES.has(url) : false),
    head,
    error: !!ssrError,
    nuxt: void 0,
    /* NuxtApp */
    payload: ssrError ? { error: ssrError } : {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set(),
    islandContext
  };
  if (import.meta.prerender && process.env.NUXT_SHARED_DATA) {
    ssrContext._sharedPrerenderCache = sharedPrerenderCache;
  }
  const _PAYLOAD_EXTRACTION = import.meta.prerender && process.env.NUXT_PAYLOAD_EXTRACTION && !ssrContext.noSSR && !isRenderingIsland;
  const payloadURL = _PAYLOAD_EXTRACTION ? joinURL(ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL, url, process.env.NUXT_JSON_PAYLOADS ? "_payload.json" : "_payload.js") + "?" + ssrContext.runtimeConfig.app.buildId : void 0;
  if (import.meta.prerender) {
    ssrContext.payload.prerenderedAt = Date.now();
  }
  const renderer = process.env.NUXT_NO_SSR || ssrContext.noSSR ? await getSPARenderer() : await getSSRRenderer();
  if (process.env.NUXT_EARLY_HINTS && !isRenderingPayload && !import.meta.prerender) {
    const { link } = renderResourceHeaders({}, renderer.rendererContext);
    if (link) {
      writeEarlyHints(event, link);
    }
  }
  if (process.env.NUXT_INLINE_STYLES && !isRenderingIsland) {
    for (const id of await getEntryIds()) {
      ssrContext.modules.add(id);
    }
  }
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response2 = renderPayloadResponse(ssrContext);
    if (import.meta.prerender) {
      await payloadCache.setItem(url, response2);
    }
    return response2;
  }
  if (_PAYLOAD_EXTRACTION) {
    appendResponseHeader(event, "x-nitro-prerender", joinURL(url, process.env.NUXT_JSON_PAYLOADS ? "_payload.json" : "_payload.js"));
    await payloadCache.setItem(withoutTrailingSlash(url), renderPayloadResponse(ssrContext));
  }
  const inlinedStyles = process.env.NUXT_INLINE_STYLES || isRenderingIsland ? await renderInlineStyles(ssrContext.modules ?? []) : [];
  const NO_SCRIPTS = process.env.NUXT_NO_SCRIPTS || routeOptions.experimentalNoScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (_PAYLOAD_EXTRACTION && !NO_SCRIPTS && !isRenderingIsland) {
    head.push({
      link: [
        process.env.NUXT_JSON_PAYLOADS ? { rel: "preload", as: "fetch", crossorigin: "anonymous", href: payloadURL } : { rel: "modulepreload", crossorigin: "", href: payloadURL }
      ]
    }, headEntryOptions);
  }
  if (isAppManifestEnabled && ssrContext._preloadManifest) {
    head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    head.push({ style: inlinedStyles });
  }
  if (!isRenderingIsland || import.meta.dev) {
    const link = [];
    for (const resource of Object.values(styles)) {
      if (import.meta.dev && "inline" in getURLQuery(resource.file)) {
        continue;
      }
      if (!import.meta.dev || !isRenderingIsland || resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      head.push({ link }, headEntryOptions);
    }
  }
  if (!NO_SCRIPTS && !isRenderingIsland) {
    head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    head.push({
      script: _PAYLOAD_EXTRACTION ? process.env.NUXT_JSON_PAYLOADS ? renderPayloadJsonScript({ ssrContext, data: splitPayload(ssrContext).initial, src: payloadURL }) : renderPayloadScript({ ssrContext, data: splitPayload(ssrContext).initial, src: payloadURL }) : process.env.NUXT_JSON_PAYLOADS ? renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) : renderPayloadScript({ ssrContext, data: ssrContext.payload })
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.experimentalNoScripts && !isRenderingIsland) {
    head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition: _PAYLOAD_EXTRACTION && !process.env.NUXT_JSON_PAYLOADS ? "bodyClose" : "head",
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(head, renderSSRHeadOptions);
  const htmlContext = {
    island: isRenderingIsland,
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      componentIslands ? replaceIslandTeleports(ssrContext, _rendered.html) : _rendered.html,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  if (isRenderingIsland && islandContext) {
    const islandHead = {};
    for (const entry of head.headEntries()) {
      for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
        const currentValue = islandHead[key];
        if (Array.isArray(currentValue)) {
          currentValue.push(...value);
        }
        islandHead[key] = value;
      }
    }
    islandHead.link ||= [];
    islandHead.style ||= [];
    const islandResponse = {
      id: islandContext.id,
      head: islandHead,
      html: getServerComponentHTML(htmlContext.body),
      components: getClientIslandResponse(ssrContext),
      slots: getSlotIslandResponse(ssrContext)
    };
    await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
    const response2 = {
      body: JSON.stringify(islandResponse, null, 2),
      statusCode: getResponseStatus(event),
      statusMessage: getResponseStatusText(event),
      headers: {
        "content-type": "application/json;charset=utf-8",
        "x-powered-by": "Nuxt"
      }
    };
    if (import.meta.prerender) {
      await islandCache.setItem(`/__nuxt_island/${islandContext.name}_${islandContext.id}.json`, response2);
      await islandPropCache.setItem(`/__nuxt_island/${islandContext.name}_${islandContext.id}.json`, event.path);
    }
    return response2;
  }
  const response = {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
  return response;
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}
function renderPayloadResponse(ssrContext) {
  return {
    body: process.env.NUXT_JSON_PAYLOADS ? stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) : `export default ${devalue(splitPayload(ssrContext).payload)}`,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": process.env.NUXT_JSON_PAYLOADS ? "application/json;charset=utf-8" : "text/javascript;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(process.env.NUXT_NO_SSR || opts.ssrContext.noSSR)
  };
  if (!multiApp) {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: multiApp ? `window.__NUXT__=window.__NUXT__||{};window.__NUXT__[${JSON.stringify(appId)}]={config:${config}}` : `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function renderPayloadScript(opts) {
  opts.data.config = opts.ssrContext.config;
  const _PAYLOAD_EXTRACTION = import.meta.prerender && process.env.NUXT_PAYLOAD_EXTRACTION && !opts.ssrContext.noSSR;
  const nuxtData = devalue(opts.data);
  if (_PAYLOAD_EXTRACTION) {
    const singleAppPayload2 = `import p from "${opts.src}";window.__NUXT__={...p,...(${nuxtData})}`;
    const multiAppPayload2 = `import p from "${opts.src}";window.__NUXT__=window.__NUXT__||{};window.__NUXT__[${JSON.stringify(appId)}]={...p,...(${nuxtData})}`;
    return [
      {
        type: "module",
        innerHTML: multiApp ? multiAppPayload2 : singleAppPayload2
      }
    ];
  }
  const singleAppPayload = `window.__NUXT__=${nuxtData}`;
  const multiAppPayload = `window.__NUXT__=window.__NUXT__||{};window.__NUXT__[${JSON.stringify(appId)}]=${nuxtData}`;
  return [
    {
      innerHTML: multiApp ? multiAppPayload : singleAppPayload
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}
function getServerComponentHTML(body) {
  const match = body[0].match(ROOT_NODE_REGEX);
  return match?.[1] || body[0];
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=[^;]*;(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, slot] = match;
      if (!slot) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}
