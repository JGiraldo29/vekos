# Nuxt Component Meta

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Gather components metadata on build time and make them available on production. This module is developed to give a visual Markdown Editor with Vue Components in it for [Nuxt Studio](https://nuxt.studio).

## Quick Setup

1. Add `nuxt-component-meta` dependency to your project:

```bash
# Using PNPM
pnpm add nuxt-component-meta

# Using NPM
npm install nuxt-component-meta
```

2. Add `nuxt-component-meta` to the `modules` section of your `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: ['nuxt-component-meta']
})
```

## Usage

```html
<template>
  <div>
    <h2>`MyComponent` metadata</h2>
    <pre>
      {{ meta }}
    </pre>
  </div>
</template>

<script script>
const { data: meta } = await useAsyncData('my-component', () => $fetch('/api/component-meta/my-component'))
</script>
```

## Nightly Builds

You can install the latest nightly build of the Studio module by running:

```bash
npm i nuxt-component-meta@nightly
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-component-meta/latest.svg?style=flat&colorA=002438&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-component-meta

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-component-meta.svg?style=flat&colorA=002438&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-component-meta

## Development

1. Clone this repository
2. Install dependencies using `pnpm install`
3. Start dev server using `pnpm dev`
