import { defineNitroPreset } from "nitropack/kit";
const node = defineNitroPreset(
  {
    entry: "./runtime/node-listener"
  },
  {
    name: "node-listener",
    aliases: ["node"],
    url: import.meta.url
  }
);
const nodeServer = defineNitroPreset(
  {
    extends: "node",
    entry: "./runtime/node-server",
    serveStatic: true,
    commands: {
      preview: "node ./server/index.mjs"
    }
  },
  {
    name: "node-server",
    url: import.meta.url
  }
);
const nodeCluster = defineNitroPreset(
  {
    extends: "node-server",
    entry: "./runtime/node-cluster"
  },
  {
    name: "node-cluster",
    url: import.meta.url
  }
);
const cli = defineNitroPreset(
  {
    extends: "node",
    entry: "./runtime/cli",
    commands: {
      preview: "Run with node ./server/index.mjs [route]"
    }
  },
  {
    name: "cli",
    url: import.meta.url
  }
);
export default [node, nodeServer, nodeCluster, cli];
