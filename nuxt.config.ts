export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true
  },

  modules: [
    '@pinia/nuxt'
  ],

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET
  }
})