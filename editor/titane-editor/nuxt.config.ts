export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/eslint'],
  // Ensure core is treated as ESM
  build: {
    transpile: ['@titane/core', 'three']
  },
  typescript: {
    shim: false,
    strict: true
  }
})
