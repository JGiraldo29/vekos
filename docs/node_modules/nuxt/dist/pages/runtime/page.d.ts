import type { KeepAliveProps, TransitionProps, VNode } from 'vue';
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    name: {
        type: StringConstructor;
    };
    transition: {
        type: () => boolean | TransitionProps;
        default: undefined;
    };
    keepalive: {
        type: () => boolean | KeepAliveProps;
        default: undefined;
    };
    route: {
        type: () => RouteLocationNormalized;
    };
    pageKey: {
        type: () => string | ((route: RouteLocationNormalizedLoaded) => string);
        default: null;
    };
}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    name: {
        type: StringConstructor;
    };
    transition: {
        type: () => boolean | TransitionProps;
        default: undefined;
    };
    keepalive: {
        type: () => boolean | KeepAliveProps;
        default: undefined;
    };
    route: {
        type: () => RouteLocationNormalized;
    };
    pageKey: {
        type: () => string | ((route: RouteLocationNormalizedLoaded) => string);
        default: null;
    };
}>> & Readonly<{}>, {
    keepalive: boolean | KeepAliveProps;
    transition: boolean | TransitionProps;
    pageKey: string | ((route: RouteLocationNormalizedLoaded) => string);
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
