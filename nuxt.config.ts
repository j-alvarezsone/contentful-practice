import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [[
    "@nuxtjs/google-fonts",
    {
      families: {
        "Instrument+Sans": true,
        "Geist": ["100..900"],
      },
      display: "swap",
    },
  ], "@nuxtjs/supabase"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ["./app/assets/css/main.css"],
  runtimeConfig: {
    CONTENT_SPACE_ID: process.env.NUXT_CONTENTFUL_SPACE_ID,
    CONTENTFUL_ENVIRONMENT: process.env.NUXT_CONTENTFUL_ENVIRONMENT,
    CONTENTFUL_DELIVERY_TOKEN: process.env.NUXT_CONTENTFUL_DELIVERY_TOKEN,
    CONTENTFUL_PREVIEW_TOKEN: process.env.NUXT_CONTENTFUL_PREVIEW_TOKEN,
  },
  typescript: {
    typeCheck: true,
  },
  supabase: {
    url: process.env.NUXT_SUPABASE_URL,
    key: process.env.NUXT_SUPABASE_PUBLISHABLE_KEY,
  },
});
