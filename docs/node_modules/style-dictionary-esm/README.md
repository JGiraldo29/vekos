# 🪶 style-dictionary-esm

[![NPM version](https://img.shields.io/npm/v/style-dictionary-esm?color=a1b858&label=)](https://www.npmjs.com/package/style-dictionary-esm)

An ESM-ready version of [Style Dictionary](https://github.com/amzn/style-dictionary).

- Fully **ESM-ready**
- Allows mocking `fs` dependency, improving browser support
- Replaces `console.log` by `consola`, with custom levels
- Replaces `node-sass` by `dart-sass`
- Replaces `glob` by `fast-glob`
- Drops `lodash` dependency
- **100%** coverage from upstream test suite
- [**PNPM**](https://pnpm.io/), [**tsup**](https://github.com/egoist/tsup), [**Vite**](https://vitejs.dev/) and [**Vitest**](https://vitest.dev) for the repository

## Install

```bash
npm i style-dictionary-esm
```

## Why

I love Design Tokens and the Style Dictionary API!

Migrating to ESM is a tedious task, but I need it to integrate it inside my projects and toolchains.

I would happily move this work as a PR on the original repo, if this makes sense in the project roadmap!

This is an initial step in doing a [Vite plugin](https://vitejs.dev/plugins) for [Style Dictionary](https://github.com/amzn/style-dictionary).

## Todos

- Improve tree-shaking
  - Moving formats per-file and require none by default
  - Avoid relying on global export
- Avoid relying on `fs` globally, but instead support unified storage layer
- Make tests paralellizable, currently `threads` has to be set to `false` due to `fs` mismatchs

## License

[Apache 2.0](LICENSE)
