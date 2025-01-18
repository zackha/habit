import pkg from './package.json';
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  future: { compatibilityVersion: 4 },
  modules: ['@nuxthub/core', 'nuxt-auth-utils', '@pinia/nuxt', '@pinia/colada-nuxt'],
  hub: {
    database: true,
  },
  runtimeConfig: {
    public: {
      version: pkg.version,
    },
  },
});
