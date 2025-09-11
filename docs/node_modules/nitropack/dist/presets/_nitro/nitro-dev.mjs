import { defineNitroPreset } from "nitropack/kit";
const nitroDev = defineNitroPreset(
  {
    extends: "node",
    entry: "./runtime/nitro-dev",
    output: {
      serverDir: "{{ buildDir }}/dev"
    },
    externals: { trace: false },
    inlineDynamicImports: true,
    // externals plugin limitation
    sourceMap: true
  },
  {
    name: "nitro-dev",
    url: import.meta.url
  }
);
export default [nitroDev];
