import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// That allows to overwrite these dependencies paths via `.env` for local development
const envModules = {
  tokens: process?.env?.THEME_DEV_TOKENS_PATH || '@nuxt-themes/tokens'
}

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [envModules.tokens],

  components: [
    { path: resolve('components/globals'), global: true, prefix: '' },
    { path: resolve('components/icons'), global: true, prefix: '' },
    { path: resolve('components/landing'), global: true, prefix: '' },
    { path: resolve('components/volta'), global: true, prefix: '' },
    { path: resolve('components/meta'), global: true, prefix: '' }
  ]
})
