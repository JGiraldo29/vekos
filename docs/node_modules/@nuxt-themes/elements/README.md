[![Nuxt Elements](https://elements.nuxt.space/cover.png)](https://elements.nuxt.space)

# Nuxt Elements

[![npm version][npm-version-src]][npm-version-href]
[![License][license-src]][license-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![Nuxt Studio][nuxt-studio-src]][nuxt-studio-href]
[![Volta][volta-src]][volta-href]

A component library to compose websites powered by [design tokens](https://design-tokens.nuxtjs.org) and Markdown, editable in [Nuxt Studio](https://nuxt.studio).

- **Documentation:** [elements.nuxt.space](https://elements.nuxt.space)
- **Online playground:** [stackblitz.com/edit/nuxt-elements-play](https://stackblitz.com/edit/nuxt-elements-play?file=content%2Findex.md)

## Usage

In your Nuxt project, install the package:

```bash
pnpm add -D @nuxt-themes/elements
```

Then in your `nuxt.config.ts`, add it to the `extends` array:

```ts
export default defineNuxtConfig({
  extends: ['@nuxt-themes/elements']
})
```

Start using the elements to build your website, checkout the list of elements on [elements.nuxt.dev](https://elements.nuxt.dev).

# Elements

An element is **a Vue component** made to be used inside the `content/` directory with the [MDC syntax](https://content.nuxtjs.org/guide/writing/mdc).

The component can have:
- Props to receive data from the editor (generated form)
- Slots using the [`<ContentSlot>`](https://content.nuxtjs.org/api/components/content-slot) component to pass MDC to the component

**Example:**

```vue
<script setup lang="ts">
defineProps({
  image: {
    type: String,
    default: null
  }
})
</script>

<template>
  <section>
      <h1 class="text-3xl font-bold text-primary-900 dark:text-primary-100">
        <ContentSlot :use="$slots.title" unwrap="p">Default title</ContentSlot>
      </h1>
      <!-- description slot is optional -->
      <p class="mt-3" v-if="$slots.description">
        <ContentSlot :use="$slots.description" unwrap="p" />
      </p>
      </div>
      <img v-if="image" :src="image" />
    </div>
  </section>
</template>
```

Note that the `<ContentSlot>` component cannot have `class` attribute because they are headless components.

## Development

Make sure to install the dependencies:

```bash
pnpm install
```

Start the playground:

```bash
pnpm dev
```

Start the documentation:

```bash
pnpm generate
```

Preview the built documentation:
```bash
pnpm preview
```

To use the elements in development in your project:

- Run the `pwd` command in the elements project and copy it, example: `/Users/atinux/Projects/nuxt-themes/elements`
- Add it to the `extends` of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  extends: '/Users/atinux/Projects/nuxt-themes/elements'
})
```

## License

[MIT License](./LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxt-themes/elements/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxt-themes/elements

[npm-downloads-src]: https://img.shields.io/npm/dt/@nuxt-themes/elements.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxt-themes/elements

[license-src]: https://img.shields.io/github/license/nuxt-themes/elements.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://github.com/nuxt-themes/elements/blob/main/LICENSE

[nuxt-studio-src]: https://img.shields.io/badge/Nuxt%20Studio-18181B?&logo=nuxt.js&logoColor=3BB5EC
[nuxt-studio-href]: https://nuxt.studio/themes/elements

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=nuxt.js
[nuxt-href]: https://nuxt.com

[volta-src]: https://user-images.githubusercontent.com/904724/209143798-32345f6c-3cf8-4e06-9659-f4ace4a6acde.svg
[volta-href]: https://volta.net/nuxt-themes/elements?utm_source=readme_elements
