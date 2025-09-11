import type { Head } from '@unhead/schema';
export interface NuxtRenderHTMLContext {
    island?: boolean;
    htmlAttrs: string[];
    head: string[];
    bodyAttrs: string[];
    bodyPrepend: string[];
    body: string[];
    bodyAppend: string[];
}
export interface NuxtIslandSlotResponse {
    props: Array<unknown>;
    fallback?: string;
}
export interface NuxtIslandClientResponse {
    html: string;
    props: unknown;
    chunk: string;
    slots?: Record<string, string>;
}
export interface NuxtIslandContext {
    id?: string;
    name: string;
    props?: Record<string, any>;
    url?: string;
    slots: Record<string, Omit<NuxtIslandSlotResponse, 'html' | 'fallback'>>;
    components: Record<string, Omit<NuxtIslandClientResponse, 'html'>>;
}
export interface NuxtIslandResponse {
    id?: string;
    html: string;
    head: Head;
    props?: Record<string, Record<string, any>>;
    components?: Record<string, NuxtIslandClientResponse>;
    slots?: Record<string, NuxtIslandSlotResponse>;
}
export interface NuxtRenderResponse {
    body: string;
    statusCode: number;
    statusMessage?: string;
    headers: Record<string, string>;
}
declare const _default: any;
export default _default;
