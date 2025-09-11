![Nuxt Plausible module](./.github/og.png)

# Nuxt Plausible

[![npm version](https://img.shields.io/npm/v/@nuxtjs/plausible?color=a1b858&label=)](https://www.npmjs.com/package/@nuxtjs/plausible)

Native integration of [Plausible Analytics](https://plausible.io/sites) for [Nuxt](https://nuxt.com).

## Features

- 🌻 No configuration necessary
- 📯 Track events and page views manually with [composables](#composables)
- 🔀 Optional API proxy to avoid ad-blockers
- 📂 [`.env` file support](#configuration)
- 🧺 Sensible default options
- 🦾 SSR-ready

## Setup

```bash
npx nuxi@latest module add plausible
```

## Basic Usage

Add `@nuxtjs/plausible` to the `modules` section of your Nuxt configuration:

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['@nuxtjs/plausible'],
})
```

Done! Plausible will now run in your application's client.

> [!TIP]
> By default, `@nuxtjs/plausible` will use `window.location.hostname` for the Plausible `domain` configuration key, which should suit most use-cases. If you need to customize the domain, you can do so in the [module options](#module-options).

## Configuration

All [supported module options](#module-options) can be configured using the `plausible` key in your Nuxt configuration:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/plausible'],

  plausible: {
    // Prevent tracking on localhost
    ignoredHostnames: ['localhost'],
  },
})
```

> [!TIP]
> To allow tracking events on localhost, set the `ignoredHostnames` option to an empty array.

### Runtime Config

Alternatively, leveraging [automatically replaced public runtime config values](https://nuxt.com/docs/api/configuration/nuxt-config#runtimeconfig) by matching environment variables at runtime, set your desired option in your project's `.env` file:

```bash
# Sets the `plausible.domain` option to `example.com`
NUXT_PUBLIC_PLAUSIBLE_DOMAIN=example.com
```

With this setup, you can omit the `plausible` key in your Nuxt configuration.

### Proxy Configuration

The module provides a proxy API feature that allows you to route Plausible events through your Nitro server instead of sending them directly to Plausible's servers. This is useful if you want to prevent ad blockers from blocking requests to Plausible's domain. When proxy is enabled, the tracker will automatically route requests through the current origin.

To enable the proxy API, set the `proxy` option to `true`:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/plausible'],

  plausible: {
    proxy: true,
  },
})
```

> [!NOTE]
> When enabled, all Plausible events will be sent to your server first, which then forwards them to Plausible's API. The default proxy endpoint is `/_plausible`, but you can customize the path using the `proxyBaseEndpoint` module option.

## Module Options

| Option                 | Type       | Default                      | Description                                                                                                                                                                                                                                     |
| ---------------------- | ---------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `enabled`              | `boolean`  | `true`                       | Whether the tracker shall be enabled.                                                                                                                                                                                                           |
| `hashMode`             | `boolean`  | `false`                      | Whether page views shall be tracked when the URL hash changes. Enable this if your Nuxt app uses the `hashMode` router option instead of the default history mode.                                                                              |
| `domain`               | `string`   | `'window.location.hostname'` | The domain to bind tracking event to.                                                                                                                                                                                                           |
| `ignoredHostnames`     | `string[]` | `['localhost']`              | Hostnames to ignore when tracking events.                                                                                                                                                                                                       |
| `ignoreSubDomains`     | `boolean`  | `false`                      | Ignore the hostname if it is a subdomain of `ignoredHostnames`.                                                                                                                                                                                 |
| `apiHost`              | `string`   | `https://plausible.io`       | The API host where the events will be sent to.                                                                                                                                                                                                  |
| `autoPageviews`        | `boolean`  | `true`                       | Track the current page and all further pages automatically. Disable this if you want to manually manage pageview tracking.                                                                                                                      |
| `autoOutboundTracking` | `boolean`  | `false`                      | Track all outbound link clicks automatically. If enabled, a [MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver) automagically detects link nodes throughout the application and binds `click` events to them. |
| `logIgnoredEvents`     | `boolean`  | `false`                      | Log events to the console if they are ignored.                                                                                                                                                                                                  |
| `proxy`                | `boolean`  | `false`                      | Whether to proxy the event endpoint through the current origin.                                                                                                                                                                                 |
| `proxyBaseEndpoint`    | `string`   | `'/_plausible'`              | The base endpoint to proxy the Plausible event endpoint through.                                                                                                                                                                                |

## Composables

As with other composables in the Nuxt ecosystem, they are auto-imported and can be used in your application's components.

> [!NOTE]
> Since the Plausible instance is available in the client only, executing the composables on the server will have no effect.

### `useTrackEvent`

Track a custom event. Track your defined goals by passing the goal's name as the argument `eventName`.

**Type Declarations**

```ts
function useTrackEvent(
  eventName: string,
  options?: EventOptions,
  eventData?: PlausibleOptions,
): void
```

**Example**

```ts
// Tracks the `signup` goal
useTrackEvent('signup')

// Tracks the `Download` goal passing a `method` property.
useTrackEvent('Download', { props: { method: 'HTTP' } })
```

### `useTrackPageview`

Manually track a page view.

Pass optional event data to be sent with the `eventData` argument. Defaults to the current page's data merged with the default options provided during the Plausible initialization.

**Type Declarations**

```ts
function useTrackPageview(
  eventData?: PlausibleOptions,
  options?: EventOptions,
): void
```

## 💻 Development

1. Clone this repository
2. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
3. Install dependencies using `pnpm install`
4. Run `pnpm run dev:prepare`
5. Start development server using `pnpm run dev`

## Credits

- [@Barbapapazes](https://github.com/Barbapapazes) for his [Plausible tracker rewrite](https://github.com/Barbapapazes/plausible-tracker)

## License

[MIT](./LICENSE) License © 2022-PRESENT [Johann Schopplich](https://github.com/johannschopplich)
