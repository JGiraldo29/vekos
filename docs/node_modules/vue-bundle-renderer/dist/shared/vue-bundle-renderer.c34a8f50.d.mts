interface ResourceMeta {
    src?: string;
    name?: string;
    file: string;
    css?: string[];
    assets?: string[];
    isEntry?: boolean;
    isDynamicEntry?: boolean;
    sideEffects?: boolean;
    imports?: string[];
    dynamicImports?: string[];
    module?: boolean;
    prefetch?: boolean;
    preload?: boolean;
    resourceType?: 'audio' | 'document' | 'embed' | 'fetch' | 'font' | 'image' | 'object' | 'script' | 'style' | 'track' | 'worker' | 'video';
    mimeType?: string;
}
interface Manifest {
    [key: string]: ResourceMeta;
}
declare function defineManifest(manifest: Manifest): Manifest;

export { type Manifest as M, type ResourceMeta as R, defineManifest as d };
