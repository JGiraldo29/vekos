import { defineComponent, onErrorCaptured, ref } from "vue";
import { useNuxtApp } from "../nuxt.js";
export default defineComponent({
  name: "NuxtErrorBoundary",
  inheritAttrs: false,
  emits: {
    error(_error) {
      return true;
    }
  },
  setup(_props, { slots, emit }) {
    const error = ref(null);
    const nuxtApp = useNuxtApp();
    if (import.meta.client) {
      onErrorCaptured((err, target, info) => {
        if (!nuxtApp.isHydrating || !nuxtApp.payload.serverRendered) {
          emit("error", err);
          nuxtApp.hooks.callHook("vue:error", err, target, info);
          error.value = err;
          return false;
        }
      });
    }
    function clearError() {
      error.value = null;
    }
    return () => error.value ? slots.error?.({ error, clearError }) : slots.default?.();
  }
});
