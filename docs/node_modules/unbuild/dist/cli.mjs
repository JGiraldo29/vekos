#!/usr/bin/env node
import { resolve } from 'pathe';
import mri from 'mri';
import { b as build } from './shared/unbuild.f0ca50ec.mjs';
import 'node:module';
import 'node:fs';
import 'chalk';
import 'consola';
import 'defu';
import 'hookable';
import 'pretty-bytes';
import 'globby';
import 'node:fs/promises';
import 'jiti';
import 'node:url';
import 'rollup';
import '@rollup/plugin-commonjs';
import '@rollup/plugin-node-resolve';
import '@rollup/plugin-alias';
import 'rollup-plugin-dts';
import '@rollup/plugin-replace';
import 'mlly';
import 'esbuild';
import '@rollup/pluginutils';
import '@rollup/plugin-json';
import 'magic-string';
import 'untyped';
import 'untyped/babel-plugin';
import 'scule';
import 'mkdist';

async function main() {
  const args = mri(process.argv.splice(2));
  const rootDir = resolve(process.cwd(), args._[0] || ".");
  await build(rootDir, args.stub).catch((error) => {
    console.error(`Error building ${rootDir}: ${error}`);
    throw error;
  });
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
