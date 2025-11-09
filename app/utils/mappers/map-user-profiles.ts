import type { GetUserProfilesQuery } from "~/generated/nuxt-tutorial";

export function mapUserProfiles(data: GetUserProfilesQuery) {
  if (!data?.usersCollection?.items) {
    console.warn("No users collection found in query response");
    return [];
  }

  const users = data.usersCollection.items.filter(Boolean);

  const profiles = users.flatMap(user =>
    user?.profilesCollection?.items?.filter(Boolean) ?? [],
  );

  return profiles.map(profile => ({
    id: profile?.sys.id ?? "",
    firstName: profile?.firstName ?? "Unnamed",
    lastName: profile?.lastName ?? "User",
    email: profile?.email ?? "",
    role: profile?.role ?? "",
    summary: profile?.summary?.json.content ?? [],
  }));
}
