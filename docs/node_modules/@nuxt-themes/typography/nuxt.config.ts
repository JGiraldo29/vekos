import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: [resolve('./main.css')],
  modules: [
    'pinceau/nuxt',
    'nuxt-icon',
    'nuxt-config-schema'
  ]
})
