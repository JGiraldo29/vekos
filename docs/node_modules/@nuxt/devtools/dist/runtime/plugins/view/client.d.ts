import type { Ref } from 'vue';
import type { Router } from 'vue-router';
declare const clientRef: import("vue").ShallowRef<any, any>;
export { clientRef as client };
export type ColorScheme = 'dark' | 'light';
export declare function setupDevToolsClient({ nuxt, clientHooks, timeMetric, router, }: {
    nuxt: any;
    clientHooks: any;
    timeMetric: any;
    router: Router;
}): Promise<void>;
export declare function useClientColorMode(): Ref<ColorScheme>;
