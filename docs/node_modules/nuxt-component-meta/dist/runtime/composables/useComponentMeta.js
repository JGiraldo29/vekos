import { reactive, computed, unref } from "vue";
import { useNuxtApp, useAsyncData } from "#imports";
export const __getComponentMeta = async () => {
  const __metas = await import("#nuxt-component-meta");
  return __metas?.default || __metas;
};
export async function useComponentMeta(componentName) {
  const nuxtApp = useNuxtApp();
  const _componentName = unref(componentName);
  if (import.meta.dev) {
    const __componentMeta = await __getComponentMeta();
    if (!nuxtApp._componentMeta) {
      nuxtApp._componentMeta = reactive(__componentMeta);
    }
    if (_componentName) {
      return computed(() => nuxtApp._componentMeta[_componentName]);
    }
    return computed(() => nuxtApp._componentMeta);
  } else {
    const { data } = await useAsyncData(
      `nuxt-component-meta${_componentName ? `-${_componentName}` : ""}`,
      () => {
        return $fetch(`/api/component-meta${_componentName ? `/${_componentName}` : ""}`);
      }
    );
    return computed(() => data.value);
  }
}
if (import.meta.dev) {
  async function applyHMR(newConfig) {
    const componentMetas = await useComponentMeta();
    if (newConfig && componentMetas.value) {
      for (const key in newConfig) {
        componentMetas.value[key] = newConfig[key];
      }
      for (const key in componentMetas.value) {
        if (!(key in newConfig)) {
          delete componentMetas.value[key];
        }
      }
    }
  }
  if (import.meta.hot) {
    import.meta.hot.accept(async (newModule) => {
      const newMetas = await newModule.__getComponentMeta();
      applyHMR(newMetas);
    });
  }
}
