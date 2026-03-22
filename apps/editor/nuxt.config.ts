export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  // Ensure core is treated as ESM
  build: {
    transpile: ['@titane/core', 'three']
  },
  typescript: {
    shim: false,
    strict: true
  }
})
