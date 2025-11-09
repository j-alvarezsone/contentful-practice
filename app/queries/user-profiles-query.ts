import { gql } from "graphql-request";

export const GetUserProfilesQuery = gql`
  query GetUserProfiles {
    usersCollection(limit: 1) {
      items {
        sys { id }
        profilesCollection(limit: 10) {
          items {
            sys { id }
            firstName
            lastName
            email
            role
            summary {
              json
            }
          }
        }
      }
    }
  }
`;
