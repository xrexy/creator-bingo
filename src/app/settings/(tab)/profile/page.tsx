import { oauthProviderStateKey } from "@/constants";
import { googleAuth } from "@/server/lucia";
import { api } from "@/trpc/server";

import * as context from "next/headers";
import { redirect } from "next/navigation";

import { config } from "@/config";
import { SettingsPageHeader } from "../../_components/SettingsPageHeader";
import { initOauthLogin } from "@/app/_actions/initOauthLogin";

export default async function SettingsLinkTabPage() {
  const loginWithGoogle = initOauthLogin.bind(null, 'GOOGLE')

  const session = await api.auth.getSession();
  const creator = session
    ? await api.auth.getCreator({ userId: session.user.userId })
    : null;

  return (
    <>
      <SettingsPageHeader meta={{ description: "General personalization settings", title: "Profile" }} />
      {creator ? (
        <h1>{JSON.stringify(creator, null, 2)}</h1>
      ) : (
        <>
          <form>
            <button formAction={loginWithGoogle}>Login with Google</button>
          </form>
        </>
      )}
    </>
  );
}

