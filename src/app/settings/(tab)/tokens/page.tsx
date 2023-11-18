import { api } from "@/trpc/server";
import { SettingsPageHeader } from "../../_components/SettingsPageHeader";
import RefreshToken from "./_components/RefreshToken";

export default async function Page() {
  const session = await api.auth.getSession();
  const creator = session
    ? await api.creator.getCreator({ userId: session.user.userId })
    : undefined;

  return (
    <>
      <SettingsPageHeader
        meta={{
          description: "Manage your API tokens.",
          title: "Tokens",
        }}
      />

      {session?.user ? (
        <RefreshToken
          creator={creator}
          session={session}
        />
      ) : (
        <p>You have to be logged in to access this page.</p>
      )}
    </>
  );
}

