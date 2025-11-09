// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    CONTENT_SPACE_ID: process.env.NUXT_CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENVIRONMENT: process.env.NUXT_CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_DELIVERY_TOKEN: process.env.NUXT_CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_PREVIEW_TOKEN: process.env.NUXT_CONTENTFUL_PREVIEW_TOKEN,
  },
  typescript: {
    typeCheck: true,
  },
});
