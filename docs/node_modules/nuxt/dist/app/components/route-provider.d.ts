import type { Ref, VNode } from 'vue';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
export declare const RouteProvider: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    vnode: {
        type: () => VNode;
        required: true;
    };
    route: {
        type: () => RouteLocationNormalizedLoaded;
        required: true;
    };
    vnodeRef: () => Ref<any>;
    renderKey: StringConstructor;
    trackRootNodes: BooleanConstructor;
}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    vnode: {
        type: () => VNode;
        required: true;
    };
    route: {
        type: () => RouteLocationNormalizedLoaded;
        required: true;
    };
    vnodeRef: () => Ref<any>;
    renderKey: StringConstructor;
    trackRootNodes: BooleanConstructor;
}>> & Readonly<{}>, {
    trackRootNodes: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
