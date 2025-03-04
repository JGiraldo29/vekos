# eslint-flat-config-utils

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Utils for managing and manipulating ESLint flat config arrays

[Documentation](https://jsr.io/@antfu/eslint-flat-config-utils/doc)

## Install

```bash
npm i eslint-flat-config-utils
```

## Utils

Most of the descriptions are written in JSDoc, you can find more details in the [documentation](https://jsr.io/@antfu/eslint-flat-config-utils/doc) via JSR.

Here listing a few highlighted ones:

### `concat`

Concatenate multiple ESLint flat configs into one, resolve the promises, and flatten the array.

```ts
// eslint.config.mjs
import { concat } from 'eslint-flat-config-utils'

export default concat(
  {
    plugins: {},
    rules: {},
  },
  // It can also takes a array of configs:
  [
    {
      plugins: {},
      rules: {},
    }
    // ...
  ],
  // Or promises:
  Promise.resolve({
    files: ['*.ts'],
    rules: {},
  })
  // ...
)
```

### `composer`

Create a chainable composer that makes manipulating ESLint flat config easier.

It extends Promise, so that you can directly await or export it to `eslint.config.mjs`

```ts
// eslint.config.mjs
import { composer } from 'eslint-flat-config-utils'

export default composer(
  {
    plugins: {},
    rules: {},
  }
  // ...some configs, accepts same arguments as `concat`
)
  .append(
    // appends more configs at the end, accepts same arguments as `concat`
  )
  .prepend(
    // prepends more configs at the beginning, accepts same arguments as `concat`
  )
  .insertAfter(
    'config-name', // specify the name of the target config, or index
    // insert more configs after the target, accepts same arguments as `concat`
  )
  .renamePlugins({
    // rename plugins
    'old-name': 'new-name',
    // for example, rename `n` from `eslint-plugin-n` to more a explicit prefix `node`
    'n': 'node'
    // applies to all plugins and rules in the configs
  })
  .override(
    'config-name', // specify the name of the target config, or index
    {
      // merge with the target config
      rules: {
        'no-console': 'off'
      },
    }
  )

// And you can directly return the composer object to `eslint.config.mjs`
```

### `extend`

Extend another flat config from a different root, and rewrite the glob paths accordingly:

```ts
import { extend } from 'eslint-flat-config-utils'

export default [
  ...await extend(
    import('./sub-package/eslint.config.mjs'),
    './sub-package/'
  )
]
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/antfu/static/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2023-PRESENT [Anthony Fu](https://github.com/antfu)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-flat-config-utils?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-flat-config-utils
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-flat-config-utils?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-flat-config-utils
[bundle-src]: https://img.shields.io/bundlephobia/minzip/eslint-flat-config-utils?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=eslint-flat-config-utils
[license-src]: https://img.shields.io/github/license/antfu/eslint-flat-config-utils.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/antfu/eslint-flat-config-utils/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/eslint-flat-config-utils
