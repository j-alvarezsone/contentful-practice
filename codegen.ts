import type { CodegenConfig } from "@graphql-codegen/cli";

import "dotenv/config";

const SPACE_ID = process.env.NUXT_CONTENTFUL_SPACE_ID;
const DELIVERY_TOKEN = process.env.NUXT_CONTENTFUL_DELIVERY_TOKEN;

if (!SPACE_ID || !DELIVERY_TOKEN) {
  console.error("CONTENTFUL_SPACE_ID or CONTENTFUL_CDA_TOKEN is not set. Skipping code generation.");
  process.exit(1);
}

const config: CodegenConfig = {
  generates: {
    "app/generated/nuxt-tutorial.ts": {
      schema: {
        [`https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`]: {
          headers: { Authorization: `Bearer ${DELIVERY_TOKEN}` },
        },
      },
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-graphql-request",
      ],
      documents: "app/**/*.ts",
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
