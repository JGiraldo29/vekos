import { defineNitroPreset } from "nitropack/kit";
import {
  deprecateSWR,
  generateEdgeFunctionFiles,
  generateFunctionFiles,
  generateStaticFiles
} from "./utils.mjs";
const vercel = defineNitroPreset(
  {
    extends: "node",
    entry: "./runtime/vercel",
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      serverDir: "{{ output.dir }}/functions/__nitro.func",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}"
    },
    commands: {
      deploy: "",
      preview: ""
    },
    hooks: {
      "rollup:before": (nitro) => {
        deprecateSWR(nitro);
      },
      async compiled(nitro) {
        await generateFunctionFiles(nitro);
      }
    }
  },
  {
    name: "vercel",
    stdName: "vercel",
    url: import.meta.url
  }
);
const vercelEdge = defineNitroPreset(
  {
    extends: "base-worker",
    entry: "./runtime/vercel-edge",
    exportConditions: ["edge-light"],
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      serverDir: "{{ output.dir }}/functions/__nitro.func",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}"
    },
    commands: {
      deploy: "",
      preview: ""
    },
    rollupConfig: {
      output: {
        format: "module"
      }
    },
    unenv: {
      inject: {
        process: void 0
      }
    },
    wasm: {
      lazy: true,
      esmImport: false
    },
    hooks: {
      "rollup:before": (nitro) => {
        deprecateSWR(nitro);
      },
      async compiled(nitro) {
        await generateEdgeFunctionFiles(nitro);
      }
    }
  },
  {
    name: "vercel-edge",
    url: import.meta.url
  }
);
const vercelStatic = defineNitroPreset(
  {
    extends: "static",
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}"
    },
    commands: {
      preview: "npx serve ./static"
    },
    hooks: {
      "rollup:before": (nitro) => {
        deprecateSWR(nitro);
      },
      async compiled(nitro) {
        await generateStaticFiles(nitro);
      }
    }
  },
  {
    name: "vercel-static",
    stdName: "vercel",
    static: true,
    url: import.meta.url
  }
);
export default [vercel, vercelEdge, vercelStatic];
