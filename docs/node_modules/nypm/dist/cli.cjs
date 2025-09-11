#!/usr/bin/env node
'use strict';

const citty = require('citty');
const pathe = require('pathe');
const consola = require('consola');
const index = require('./index.cjs');
require('node:fs');
require('node:fs/promises');
require('node:module');
require('ufo');
require('pkg-types');

const name = "nypm";
const version = "0.4.1";
const description = "Unified Package Manager for Node.js";

const operationArgs = {
  cwd: {
    type: "string",
    description: "Current working directory"
  },
  workspace: {
    type: "boolean",
    description: "Add to workspace"
  },
  silent: {
    type: "boolean",
    description: "Run in silent mode"
  }
};
const install = citty.defineCommand({
  meta: {
    description: "Install dependencies"
  },
  args: {
    ...operationArgs,
    name: {
      type: "positional",
      description: "Dependency name",
      required: false
    },
    dev: {
      type: "boolean",
      alias: "D",
      description: "Add as dev dependency"
    },
    global: {
      type: "boolean",
      alias: "g",
      description: "Add globally"
    },
    "frozen-lockfile": {
      type: "boolean",
      description: "Install dependencies with frozen lock file"
    }
  },
  run: async ({ args }) => {
    await (args._.length > 0 ? index.addDependency(args._, args) : index.installDependencies(args));
  }
});
const remove = citty.defineCommand({
  meta: {
    description: "Remove dependencies"
  },
  args: {
    name: {
      type: "positional",
      description: "Dependency name",
      required: true
    },
    ...operationArgs
  },
  run: async ({ args }) => {
    await index.removeDependency(args.name, args);
  }
});
const detect = citty.defineCommand({
  meta: {
    description: "Detect the current package manager"
  },
  args: {
    cwd: {
      type: "string",
      description: "Current working directory"
    }
  },
  run: async ({ args }) => {
    const cwd = pathe.resolve(args.cwd || ".");
    const packageManager = await index.detectPackageManager(cwd);
    if (!packageManager) {
      consola.consola.error(`Cannot detect package manager in \`${cwd}\``);
      return process.exit(1);
    }
    consola.consola.log(
      `Detected package manager in \`${cwd}\`: \`${packageManager.name}@${packageManager.version}\``
    );
  }
});
const main = citty.defineCommand({
  meta: {
    name,
    version,
    description
  },
  subCommands: {
    install,
    i: install,
    add: install,
    remove,
    rm: remove,
    uninstall: remove,
    un: remove,
    detect
  }
});
citty.runMain(main);
