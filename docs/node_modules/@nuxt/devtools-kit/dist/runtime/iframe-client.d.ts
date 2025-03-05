import type { NuxtDevtoolsIframeClient } from '@nuxt/devtools-kit/types';
import type { Ref } from 'vue';
export declare function onDevtoolsClientConnected(fn: (client: NuxtDevtoolsIframeClient) => void): (() => void) | undefined;
export declare function useDevtoolsClient(): Ref<any, any>;
