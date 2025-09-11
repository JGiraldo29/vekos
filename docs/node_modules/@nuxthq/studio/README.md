# Nuxt Studio Module

<!-- [![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href] -->

Official module of [Nuxt Studio](https://nuxt.studio).

Edit your websites made with [Nuxt Content](https://content.nuxt.com/), in production on any device.

📖&nbsp; Official [Documentation](https://nuxt.studio/docs/get-started/setup)

## Features

- 🚀&nbsp; Production [live preview](https://nuxt.studio/docs/projects/preview)
- ⌨️&nbsp; Edit your [content](https://nuxt.studio/docs/developers/content)
- ⚙️&nbsp; Update your [configs](https://nuxt.studio/docs/developers/app-config)

## Installation

Install the dependency to your project:

```bash
npx nuxi@latest module add studio
```

Then, register the module in your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxthq/studio'
  ]
})
```

## Configuration

Check out our setup [requirements](https://nuxt.studio/docs/projects/setup#requirements-to-use-the-studio-editor). 

By default the Studio API is `https://api.nuxt.studio`. If you want to customise it, you can set the `STUDIO_API` environement variable.

```bash
# .env
STUDIO_API=http://localhost:{PORT}
```

## Nightly Builds

You can install the latest nightly build of the Studio module by running:

```bash
npx nuxi@latest module add studio
```

### Development

- Run `pnpm i` to install dependencies.
- Run `pnpm dev:prepare` to prepare the module in development mode.
- Run `pnpm dev` to start the dev server using [`playground/`](./playground/) as the project.
- Visit http://localhost:3000/

## License

[MIT License](./LICENSE)

Copyright (c) NuxtLabs

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxthq/studio/latest.svg
[npm-version-href]: https://npmjs.com/package/@nuxthq/studio

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxthq/studio.svg
[npm-downloads-href]: https://npmjs.com/package/@nuxthq/studio

[github-actions-ci-src]: https://github.com/nuxtlabs/studio/workflows/studio/badge.svg
[github-actions-ci-href]: https://github.com/nuxtlabs/studio/actions/workflows/studio.yml

[codecov-src]: https://img.shields.io/codecov/c/github/@nuxthq/studio.svg
[codecov-href]: https://codecov.io/gh/@nuxthq/studio

[license-src]: https://img.shields.io/npm/l/@nuxthq/studio.svg
[license-href]: https://npmjs.com/package/@nuxthq/studio
