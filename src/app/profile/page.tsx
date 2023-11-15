import { config } from "@/config";
import { oauthProviderStateKey } from "@/constants";
import { googleAuth } from "@/server/lucia";
import { api } from "@/trpc/server";

import * as context from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const loginWithGoogle = async () => {
    "use server";

    const [url, state] = await googleAuth.getAuthorizationUrl();
    context.cookies().set(oauthProviderStateKey.GOOGLE, state, {
      httpOnly: true,
      secure: config.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    console.log(`Redirecting to [${state}] ${url.toString()}`);

    redirect(url.toString());
  };

  const session = await api.auth.getSession();
  const creator = session
    ? await api.auth.getCreator({ userId: session.user.userId })
    : null;

  return (
    <>
      <h1>Profile</h1>
      {creator ? (
        <h1>{JSON.stringify(creator, null, 2)}</h1>
      ) : (
        <form>
          <button formAction={loginWithGoogle}>Login with Google</button>
        </form>
      )}
    </>
  );
}

