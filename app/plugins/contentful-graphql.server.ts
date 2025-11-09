import { GraphQLClient } from "graphql-request";

import { getSdk } from "~/generated/nuxt-tutorial";

export default defineNuxtPlugin({
  name: "contentful-graphql",
  setup() {
    const config = useRuntimeConfig();

    const endpoint = `https://graphql.contentful.com/content/v1/spaces/${config.CONTENT_SPACE_ID}`;

    const client = new GraphQLClient(endpoint, {
      headers: {
        Authorization: `Bearer ${config.CONTENTFUL_DELIVERY_TOKEN}`,
      },
    });

    const sdk = getSdk(client);

    return {
      provide: {
        cf: sdk,
      },
    };
  },
});
