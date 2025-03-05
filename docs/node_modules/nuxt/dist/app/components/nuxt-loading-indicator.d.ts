declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    throttle: {
        type: NumberConstructor;
        default: number;
    };
    duration: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    color: {
        type: (BooleanConstructor | StringConstructor)[];
        default: string;
    };
    errorColor: {
        type: StringConstructor;
        default: string;
    };
    estimatedProgress: {
        type: () => (duration: number, elapsed: number) => number;
        required: false;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    throttle: {
        type: NumberConstructor;
        default: number;
    };
    duration: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    color: {
        type: (BooleanConstructor | StringConstructor)[];
        default: string;
    };
    errorColor: {
        type: StringConstructor;
        default: string;
    };
    estimatedProgress: {
        type: () => (duration: number, elapsed: number) => number;
        required: false;
    };
}>> & Readonly<{}>, {
    color: string | boolean;
    height: number;
    duration: number;
    throttle: number;
    errorColor: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
