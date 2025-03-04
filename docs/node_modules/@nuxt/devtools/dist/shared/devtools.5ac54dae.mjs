import { defineNuxtModule } from '@nuxt/kit';
import { isGlobalInstall } from '../dirs.mjs';

const r=Object.create(null),i=e=>globalThis.process?.env||import.meta.env||globalThis.Deno?.env.toObject()||globalThis.__env__||(e?r:globalThis),s=new Proxy(r,{get(e,o){return i()[o]??r[o]},has(e,o){const E=i();return o in E||o in r},set(e,o,E){const b=i(!0);return b[o]=E,!0},deleteProperty(e,o){if(!o)return !1;const E=i(!0);return delete E[o],!0},ownKeys(){const e=i(!0);return Object.keys(e)}}),t=typeof process<"u"&&process.env&&process.env.NODE_ENV||"",B=[["APPVEYOR"],["AWS_AMPLIFY","AWS_APP_ID",{ci:!0}],["AZURE_PIPELINES","SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"],["AZURE_STATIC","INPUT_AZURE_STATIC_WEB_APPS_API_TOKEN"],["APPCIRCLE","AC_APPCIRCLE"],["BAMBOO","bamboo_planKey"],["BITBUCKET","BITBUCKET_COMMIT"],["BITRISE","BITRISE_IO"],["BUDDY","BUDDY_WORKSPACE_ID"],["BUILDKITE"],["CIRCLE","CIRCLECI"],["CIRRUS","CIRRUS_CI"],["CLOUDFLARE_PAGES","CF_PAGES",{ci:!0}],["CODEBUILD","CODEBUILD_BUILD_ARN"],["CODEFRESH","CF_BUILD_ID"],["DRONE"],["DRONE","DRONE_BUILD_EVENT"],["DSARI"],["GITHUB_ACTIONS"],["GITLAB","GITLAB_CI"],["GITLAB","CI_MERGE_REQUEST_ID"],["GOCD","GO_PIPELINE_LABEL"],["LAYERCI"],["HUDSON","HUDSON_URL"],["JENKINS","JENKINS_URL"],["MAGNUM"],["NETLIFY"],["NETLIFY","NETLIFY_LOCAL",{ci:!1}],["NEVERCODE"],["RENDER"],["SAIL","SAILCI"],["SEMAPHORE"],["SCREWDRIVER"],["SHIPPABLE"],["SOLANO","TDDIUM"],["STRIDER"],["TEAMCITY","TEAMCITY_VERSION"],["TRAVIS"],["VERCEL","NOW_BUILDER"],["VERCEL","VERCEL",{ci:!1}],["VERCEL","VERCEL_ENV",{ci:!1}],["APPCENTER","APPCENTER_BUILD_ID"],["CODESANDBOX","CODESANDBOX_SSE",{ci:!1}],["STACKBLITZ"],["STORMKIT"],["CLEAVR"],["ZEABUR"],["CODESPHERE","CODESPHERE_APP_ID",{ci:!0}],["RAILWAY","RAILWAY_PROJECT_ID"],["RAILWAY","RAILWAY_SERVICE_ID"],["DENO-DEPLOY","DENO_DEPLOYMENT_ID"],["FIREBASE_APP_HOSTING","FIREBASE_APP_HOSTING",{ci:!0}]];function p(){if(globalThis.process?.env)for(const e of B){const o=e[1]||e[0];if(globalThis.process?.env[o])return {name:e[0].toLowerCase(),...e[2]}}return globalThis.process?.env?.SHELL==="/bin/jsh"&&globalThis.process?.versions?.webcontainer?{name:"stackblitz",ci:!1}:{name:"",ci:!1}}const l=p(),d=l.name;function n(e){return e?e!=="false":!1}const I=globalThis.process?.platform||"",T=n(s.CI)||l.ci!==!1,R=n(globalThis.process?.stdout&&globalThis.process?.stdout.isTTY);n(s.DEBUG);const A=t==="test"||n(s.TEST);n(s.MINIMAL)||T||A||!R;const _=/^win/i.test(I);!n(s.NO_COLOR)&&(n(s.FORCE_COLOR)||(R||_)&&s.TERM!=="dumb"||T);const C=(globalThis.process?.versions?.node||"").replace(/^v/,"")||null;Number(C?.split(".")[0])||null;const y=globalThis.process||Object.create(null),c={versions:{}};new Proxy(y,{get(e,o){if(o==="env")return s;if(o in e)return e[o];if(o in c)return c[o]}});const L=globalThis.process?.release?.name==="node",a=!!globalThis.Bun||!!globalThis.process?.versions?.bun,D=!!globalThis.Deno,O=!!globalThis.fastly,S=!!globalThis.Netlify,N=!!globalThis.EdgeRuntime,P=globalThis.navigator?.userAgent==="Cloudflare-Workers",F=[[S,"netlify"],[N,"edge-light"],[P,"workerd"],[O,"fastly"],[D,"deno"],[a,"bun"],[L,"node"]];function G(){const e=F.find(o=>o[0]);if(e)return {name:e[1]}}const u=G();u?.name||"";

const WS_EVENT_NAME = "nuxt:devtools:rpc";
const isSandboxed = d === "stackblitz" || d === "codesandbox";
const defaultOptions = {
  enabled: void 0,
  // determine multiple conditions
  componentInspector: true,
  viteInspect: true,
  vscode: {
    enabled: true,
    startOnBoot: false,
    port: 3080,
    reuseExistingServer: true
  },
  disableAuthorization: isSandboxed
};
const defaultTabOptions = {
  behavior: {
    telemetry: null
  },
  ui: {
    componentsView: "list",
    componentsGraphShowNodeModules: false,
    componentsGraphShowGlobalComponents: true,
    componentsGraphShowPages: false,
    componentsGraphShowLayouts: false,
    componentsGraphShowWorkspace: true,
    interactionCloseOnOutsideClick: false,
    showExperimentalFeatures: false,
    showHelpButtons: true,
    showPanel: null,
    scale: 1,
    minimizePanelInactive: 5e3,
    hiddenTabs: [],
    pinnedTabs: [],
    hiddenTabCategories: [],
    sidebarExpanded: false,
    sidebarScrollable: false
  },
  serverRoutes: {
    selectedRoute: null,
    view: "tree",
    inputDefaults: {
      query: [],
      body: [],
      headers: []
    },
    sendFrom: "app"
  },
  serverTasks: {
    enabled: false,
    selectedTask: null,
    view: "list",
    inputDefaults: {
      query: [],
      body: [],
      headers: [{ active: true, key: "Content-Type", value: "application/json", type: "string" }]
    }
  },
  assets: {
    view: "grid"
  }
};
const defaultAllowedExtensions = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "ico",
  "mp4",
  "ogg",
  "mp3",
  "wav",
  "mov",
  "mkv",
  "mpg",
  "txt",
  "ttf",
  "woff",
  "woff2",
  "eot",
  "json",
  "js",
  "jsx",
  "ts",
  "tsx",
  "md",
  "mdx",
  "vue",
  "webm"
];

const module = defineNuxtModule({
  meta: {
    name: "@nuxt/devtools",
    configKey: "devtools"
  },
  defaults: defaultOptions,
  setup(options, nuxt) {
    if (process.env.VITEST || process.env.TEST)
      return;
    if (typeof options === "boolean")
      options = { enabled: options };
    if (options.enabled === false)
      return;
    if (isGlobalInstall()) {
      const globalOptions = nuxt.options.devtoolsGlobal || {};
      if (options.enabled !== true && !globalOptions.projects?.includes(nuxt.options.rootDir))
        return;
    }
    return import('../chunks/module-main.mjs').then(function (n) { return n.m; }).then(({ enableModule }) => enableModule(options, nuxt));
  }
});

export { WS_EVENT_NAME as W, defaultTabOptions as a, defaultAllowedExtensions as d, module as m };
