import { computed, getCurrentInstance, getCurrentScope, onBeforeMount, onScopeDispose, onServerPrefetch, onUnmounted, ref, shallowRef, toRef, unref, watch } from "vue";
import { useNuxtApp } from "../nuxt.js";
import { toArray } from "../utils.js";
import { createError } from "./error.js";
import { onNuxtReady } from "./ready.js";
import { asyncDataDefaults, resetAsyncDataToUndefined } from "#build/nuxt.config.mjs";
const isDefer = (dedupe) => dedupe === "defer" || dedupe === false;
export function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  let [key, _handler, options = {}] = args;
  if (typeof key !== "string") {
    throw new TypeError("[nuxt] [asyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [asyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  const handler = import.meta.client || !import.meta.prerender || !nuxtApp.ssrContext?._sharedPrerenderCache ? _handler : () => {
    const value = nuxtApp.ssrContext._sharedPrerenderCache.get(key);
    if (value) {
      return value;
    }
    const promise = Promise.resolve().then(() => nuxtApp.runWithContext(_handler));
    nuxtApp.ssrContext._sharedPrerenderCache.set(key, promise);
    return promise;
  };
  const getDefault = () => asyncDataDefaults.value;
  const getDefaultCachedData = () => nuxtApp.isHydrating ? nuxtApp.payload.data[key] : nuxtApp.static.data[key];
  options.server = options.server ?? true;
  options.default = options.default ?? getDefault;
  options.getCachedData = options.getCachedData ?? getDefaultCachedData;
  options.lazy = options.lazy ?? false;
  options.immediate = options.immediate ?? true;
  options.deep = options.deep ?? asyncDataDefaults.deep;
  options.dedupe = options.dedupe ?? "cancel";
  if (import.meta.dev && typeof options.dedupe === "boolean") {
    console.warn("[nuxt] `boolean` values are deprecated for the `dedupe` option of `useAsyncData` and will be removed in the future. Use 'cancel' or 'defer' instead.");
  }
  const initialCachedData = options.getCachedData(key, nuxtApp);
  const hasCachedData = initialCachedData != null;
  if (!nuxtApp._asyncData[key] || !options.immediate) {
    nuxtApp.payload._errors[key] ??= asyncDataDefaults.errorValue;
    const _ref = options.deep ? ref : shallowRef;
    nuxtApp._asyncData[key] = {
      data: _ref(hasCachedData ? initialCachedData : options.default()),
      pending: ref(!hasCachedData),
      error: toRef(nuxtApp.payload._errors, key),
      status: ref("idle"),
      _default: options.default
    };
  }
  const asyncData = { ...nuxtApp._asyncData[key] };
  delete asyncData._default;
  asyncData.refresh = asyncData.execute = (opts = {}) => {
    if (nuxtApp._asyncDataPromises[key]) {
      if (isDefer(opts.dedupe ?? options.dedupe)) {
        return nuxtApp._asyncDataPromises[key];
      }
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    if (opts._initial || nuxtApp.isHydrating && opts._initial !== false) {
      const cachedData = opts._initial ? initialCachedData : options.getCachedData(key, nuxtApp);
      if (cachedData != null) {
        return Promise.resolve(cachedData);
      }
    }
    asyncData.pending.value = true;
    asyncData.status.value = "pending";
    const promise = new Promise(
      (resolve, reject) => {
        try {
          resolve(handler(nuxtApp));
        } catch (err) {
          reject(err);
        }
      }
    ).then(async (_result) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      let result = _result;
      if (options.transform) {
        result = await options.transform(_result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      if (import.meta.dev && import.meta.server && typeof result === "undefined") {
        console.warn(`[nuxt] \`${options._functionName || "useAsyncData"}\` must return a value (it should not be \`undefined\`) or the request may be duplicated on the client side.`);
      }
      nuxtApp.payload.data[key] = result;
      asyncData.data.value = result;
      asyncData.error.value = asyncDataDefaults.errorValue;
      asyncData.status.value = "success";
    }).catch((error) => {
      if (promise.cancelled) {
        return nuxtApp._asyncDataPromises[key];
      }
      asyncData.error.value = createError(error);
      asyncData.data.value = unref(options.default());
      asyncData.status.value = "error";
    }).finally(() => {
      if (promise.cancelled) {
        return;
      }
      asyncData.pending.value = false;
      delete nuxtApp._asyncDataPromises[key];
    });
    nuxtApp._asyncDataPromises[key] = promise;
    return nuxtApp._asyncDataPromises[key];
  };
  asyncData.clear = () => clearNuxtDataByKey(nuxtApp, key);
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (import.meta.server && fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  if (import.meta.client) {
    const instance = getCurrentInstance();
    if (instance && fetchOnServer && options.immediate && !instance.sp) {
      instance.sp = [];
    }
    if (import.meta.dev && !nuxtApp.isHydrating && !nuxtApp._processingMiddleware && (!instance || instance?.isMounted)) {
      console.warn(`[nuxt] [${options._functionName || "useAsyncData"}] Component is already mounted, please use $fetch instead. See https://nuxt.com/docs/getting-started/data-fetching`);
    }
    if (instance && !instance._nuxtOnBeforeMountCbs) {
      instance._nuxtOnBeforeMountCbs = [];
      const cbs = instance._nuxtOnBeforeMountCbs;
      onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      onUnmounted(() => cbs.splice(0, cbs.length));
    }
    if (fetchOnServer && nuxtApp.isHydrating && (asyncData.error.value || initialCachedData != null)) {
      asyncData.pending.value = false;
      asyncData.status.value = asyncData.error.value ? "error" : "success";
    } else if (instance && (nuxtApp.payload.serverRendered && nuxtApp.isHydrating || options.lazy) && options.immediate) {
      instance._nuxtOnBeforeMountCbs.push(initialFetch);
    } else if (options.immediate) {
      initialFetch();
    }
    const hasScope = getCurrentScope();
    if (options.watch) {
      const unsub = watch(options.watch, () => asyncData.refresh());
      if (hasScope) {
        onScopeDispose(unsub);
      }
    }
    const off = nuxtApp.hook("app:data:refresh", async (keys) => {
      if (!keys || keys.includes(key)) {
        await asyncData.refresh();
      }
    });
    if (hasScope) {
      onScopeDispose(off);
    }
  }
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
export function useLazyAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [key, handler, options = {}] = args;
  if (import.meta.dev && import.meta.client) {
    options._functionName ||= "useLazyAsyncData";
  }
  return useAsyncData(key, handler, { ...options, lazy: true }, null);
}
export function useNuxtData(key) {
  const nuxtApp = useNuxtApp();
  if (!(key in nuxtApp.payload.data)) {
    nuxtApp.payload.data[key] = asyncDataDefaults.value;
  }
  return {
    data: computed({
      get() {
        return nuxtApp._asyncData[key]?.data.value ?? nuxtApp.payload.data[key];
      },
      set(value) {
        if (nuxtApp._asyncData[key]) {
          nuxtApp._asyncData[key].data.value = value;
        } else {
          nuxtApp.payload.data[key] = value;
        }
      }
    })
  };
}
export async function refreshNuxtData(keys) {
  if (import.meta.server) {
    return Promise.resolve();
  }
  await new Promise((resolve) => onNuxtReady(resolve));
  const _keys = keys ? toArray(keys) : void 0;
  await useNuxtApp().hooks.callHookParallel("app:data:refresh", _keys);
}
export function clearNuxtData(keys) {
  const nuxtApp = useNuxtApp();
  const _allKeys = Object.keys(nuxtApp.payload.data);
  const _keys = !keys ? _allKeys : typeof keys === "function" ? _allKeys.filter(keys) : toArray(keys);
  for (const key of _keys) {
    clearNuxtDataByKey(nuxtApp, key);
  }
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = asyncDataDefaults.errorValue;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = resetAsyncDataToUndefined ? void 0 : unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = asyncDataDefaults.errorValue;
    nuxtApp._asyncData[key].pending.value = false;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    if (nuxtApp._asyncDataPromises[key]) {
      nuxtApp._asyncDataPromises[key].cancelled = true;
    }
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
