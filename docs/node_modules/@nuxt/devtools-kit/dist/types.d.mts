import { V as VueInspectorData, a as VueInspectorClient, H as HookInfo, P as PluginMetric, L as LoadingTimeMetric, b as ServerFunctions, C as ClientFunctions } from './shared/devtools-kit.s0VF6R5p.mjs';
export { A as AnalyzeBuildMeta, c as AnalyzeBuildsInfo, W as AssetEntry, U as AssetInfo, Q as AssetType, r as AutoImportsWithMetadata, B as BasicModuleInfo, m as CategorizedTabs, a5 as ClientUpdateEvent, _ as CodeServerOptions, $ as CodeServerType, X as CodeSnippet, G as CompatibilityStatus, Y as ComponentRelationship, Z as ComponentWithRelationships, ad as GetWizardArgs, O as GitHubContributor, I as ImageMeta, a7 as InstallModuleReturn, z as InstalledModuleInfo, K as MaintainerInfo, k as ModuleBuiltinTab, E as ModuleCompatibility, M as ModuleCustomTab, a1 as ModuleGlobalOptions, j as ModuleIframeTabLazyOptions, f as ModuleIframeView, h as ModuleLaunchAction, e as ModuleLaunchView, a0 as ModuleOptions, D as ModuleStaticInfo, F as ModuleStats, l as ModuleTabInfo, J as ModuleType, g as ModuleVNodeView, i as ModuleView, q as NpmCommandOptions, p as NpmCommandType, a4 as NuxtDevToolsOptions, N as NuxtDevtoolsInfo, a6 as NuxtDevtoolsServerContext, o as PackageManagerName, n as PackageUpdateInfo, v as Payload, y as PluginInfoWithMetic, R as RouteInfo, x as ScannedNitroTasks, s as ServerRouteInfo, u as ServerRouteInput, t as ServerRouteInputType, w as ServerTaskInfo, S as SubprocessOptions, d as TabCategory, a9 as TerminalAction, a8 as TerminalBase, aa as TerminalInfo, T as TerminalState, a2 as VSCodeIntegrationOptions, a3 as VSCodeTunnelOptions, ac as WizardActions, ab as WizardFunctions } from './shared/devtools-kit.s0VF6R5p.mjs';
import { BirpcReturn } from 'birpc';
import { Hookable } from 'hookable';
import { NuxtApp } from 'nuxt/app';
import { AppConfig } from 'nuxt/schema';
import { $Fetch } from 'ofetch';
import { BuiltinLanguage } from 'shiki';
import { Ref } from 'vue';
import { StackFrame } from 'error-stack-parser-es';
import 'unimport';
import 'vite-plugin-vue-inspector';
import 'vue-router';
import 'nitropack';
import 'unstorage';
import '@nuxt/schema';
import 'execa';

interface TimelineEventFunction {
    type: 'function';
    start: number;
    end?: number;
    name: string;
    args?: any[];
    result?: any;
    stacktrace?: StackFrame[];
    isPromise?: boolean;
}
interface TimelineServerState {
    timeSsrStart?: number;
}
interface TimelineEventRoute {
    type: 'route';
    start: number;
    end?: number;
    from: string;
    to: string;
}
interface TimelineOptions {
    enabled: boolean;
    stacktrace: boolean;
    arguments: boolean;
}
type TimelineEvent = TimelineEventFunction | TimelineEventRoute;
interface TimelineMetrics {
    events: TimelineEvent[];
    nonLiteralSymbol: symbol;
    options: TimelineOptions;
}
interface TimelineEventNormalized<T> {
    event: T;
    segment: TimelineEventsSegment;
    relativeStart: number;
    relativeWidth: number;
    layer: number;
}
interface TimelineEventsSegment {
    start: number;
    end: number;
    events: TimelineEvent[];
    functions: TimelineEventNormalized<TimelineEventFunction>[];
    route?: TimelineEventNormalized<TimelineEventRoute>;
    duration: number;
    previousGap?: number;
}

interface DevToolsFrameState {
    width: number;
    height: number;
    top: number;
    left: number;
    open: boolean;
    route: string;
    position: 'left' | 'right' | 'bottom' | 'top';
    closeOnOutsideClick: boolean;
    minimizePanelInactive: number;
}
interface NuxtDevtoolsClientHooks {
    /**
     * When the DevTools navigates, used for persisting the current tab
     */
    'devtools:navigate': (path: string) => void;
    /**
     * Event emitted when the component inspector is updated
     */
    'host:inspector:update': (data: VueInspectorData) => void;
    /**
     * Event emitted when the component inspector is clicked
     */
    'host:inspector:click': (url: URL) => void;
    /**
     * Event to close the component inspector
     */
    'host:inspector:close': () => void;
    /**
     * Triggers reactivity manually, since Vue won't be reactive across frames)
     */
    'host:update:reactivity': () => void;
    /**
     * Host action to control the DevTools navigation
     */
    'host:action:navigate': (path: string) => void;
    /**
     * Host action to reload the DevTools
     */
    'host:action:reload': () => void;
}
/**
 * Host client from the App
 */
interface NuxtDevtoolsHostClient {
    nuxt: NuxtApp;
    hooks: Hookable<NuxtDevtoolsClientHooks>;
    getIframe: () => HTMLIFrameElement | undefined;
    inspector?: {
        instance?: VueInspectorClient;
        enable: () => void;
        disable: () => void;
        toggle: () => void;
        isEnabled: Ref<boolean>;
    };
    devtools: {
        close: () => void;
        open: () => void;
        toggle: () => void;
        reload: () => void;
        navigate: (path: string) => void;
        /**
         * Popup the DevTools frame into Picture-in-Picture mode
         *
         * Requires Chrome 111 with experimental flag enabled.
         *
         * Function is undefined when not supported.
         *
         * @see https://developer.chrome.com/docs/web-platform/document-picture-in-picture/
         */
        popup?: () => any;
    };
    app: {
        reload: () => void;
        navigate: (path: string, hard?: boolean) => void;
        appConfig: AppConfig;
        colorMode: Ref<'dark' | 'light'>;
        frameState: Ref<DevToolsFrameState>;
        $fetch: $Fetch;
    };
    metrics: {
        clientHooks: () => HookInfo[];
        clientPlugins: () => PluginMetric[] | undefined;
        clientTimeline: () => TimelineMetrics | undefined;
        loading: () => LoadingTimeMetric;
    };
    /**
     * A counter to trigger reactivity updates
     */
    revision: Ref<number>;
    /**
     * Update client
     * @internal
     */
    syncClient: () => NuxtDevtoolsHostClient;
}
interface NuxtDevtoolsClient {
    rpc: BirpcReturn<ServerFunctions, ClientFunctions>;
    renderCodeHighlight: (code: string, lang?: BuiltinLanguage) => {
        code: string;
        supported: boolean;
    };
    renderMarkdown: (markdown: string) => string;
    colorMode: string;
    extendClientRpc: <ServerFunctions = Record<string, never>, ClientFunctions = Record<string, never>>(name: string, functions: ClientFunctions) => BirpcReturn<ServerFunctions, ClientFunctions>;
}
interface NuxtDevtoolsIframeClient {
    host: NuxtDevtoolsHostClient;
    devtools: NuxtDevtoolsClient;
}
interface NuxtDevtoolsGlobal {
    setClient: (client: NuxtDevtoolsHostClient) => void;
}

export { ClientFunctions, type DevToolsFrameState, HookInfo, LoadingTimeMetric, type NuxtDevtoolsClient, type NuxtDevtoolsClientHooks, type NuxtDevtoolsGlobal, type NuxtDevtoolsHostClient, type NuxtDevtoolsIframeClient, PluginMetric, ServerFunctions, type TimelineEvent, type TimelineEventFunction, type TimelineEventNormalized, type TimelineEventRoute, type TimelineEventsSegment, type TimelineMetrics, type TimelineOptions, type TimelineServerState, VueInspectorClient, VueInspectorData };
