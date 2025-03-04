import { isChangingPage } from "../components/utils.js";
import { useRouter } from "../composables/router.js";
import { defineNuxtPlugin } from "../nuxt.js";
import { appViewTransition as defaultViewTransition } from "#build/nuxt.config.mjs";
export default defineNuxtPlugin((nuxtApp) => {
  if (!document.startViewTransition) {
    return;
  }
  let finishTransition;
  let abortTransition;
  const router = useRouter();
  router.beforeResolve(async (to, from) => {
    const viewTransitionMode = to.meta.viewTransition ?? defaultViewTransition;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prefersNoTransition = prefersReducedMotion && viewTransitionMode !== "always";
    if (viewTransitionMode === false || prefersNoTransition || !isChangingPage(to, from)) {
      return;
    }
    const promise = new Promise((resolve, reject) => {
      finishTransition = resolve;
      abortTransition = reject;
    });
    let changeRoute;
    const ready = new Promise((resolve) => changeRoute = resolve);
    const transition = document.startViewTransition(() => {
      changeRoute();
      return promise;
    });
    transition.finished.then(() => {
      abortTransition = void 0;
      finishTransition = void 0;
    });
    await nuxtApp.callHook("page:view-transition:start", transition);
    return ready;
  });
  nuxtApp.hook("vue:error", () => {
    abortTransition?.();
    abortTransition = void 0;
  });
  nuxtApp.hook("page:finish", () => {
    finishTransition?.();
    finishTransition = void 0;
  });
});
