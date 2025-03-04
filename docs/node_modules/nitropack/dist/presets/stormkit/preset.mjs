import { defineNitroPreset } from "nitropack/kit";
const stormkit = defineNitroPreset(
  {
    entry: "./runtime/stormkit",
    output: {
      dir: "{{ rootDir }}/.stormkit"
    }
  },
  {
    name: "stormkit",
    stdName: "stormkit",
    url: import.meta.url
  }
);
export default [stormkit];
