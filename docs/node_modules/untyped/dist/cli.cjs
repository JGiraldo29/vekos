#!/usr/bin/env node
'use strict';

const promises = require('node:fs/promises');
const node_path = require('node:path');
const citty = require('citty');

const load = citty.defineCommand({
  meta: {
    name: "load",
    description: "Load a schema from the specified entry path"
  },
  args: {
    entryPath: {
      type: "positional",
      required: true,
      description: "Path to the entry file"
    },
    write: {
      type: "string",
      required: false,
      description: "Write the output to a file"
    },
    ignoreDefaults: {
      type: "boolean",
      required: false,
      description: "Ignore default values"
    }
  },
  async run({ args }) {
    const { loadSchema } = await import('./loader/loader.cjs');
    const cwd = process.cwd();
    const schema = await loadSchema(node_path.resolve(cwd, args.entryPath), {
      ignoreDefaults: args.ignoreDefaults
    });
    if (args.write) {
      const json = JSON.stringify(schema, null, 2);
      const outfile = node_path.resolve(
        cwd,
        args.write === "true" ? "schema.json" : args.write
      );
      await promises.writeFile(outfile, json);
    } else {
      console.log(schema);
    }
  }
});
const cli = citty.defineCommand({
  meta: {
    name: "untyped",
    description: "CLI tool for untyped operations"
  },
  subCommands: {
    load
  }
});
citty.runMain(cli).catch((error) => {
  console.error(error);
  process.exit(1);
});
