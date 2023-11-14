import { config } from "@/config";
import { oauthProviderStateKey } from "@/constants";
import { session } from "@/server/db/schema";
import { auth, twitchAuth } from "@/server/lucia";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import * as context from "next/headers";
import { redirect } from "next/navigation";

export async function TwitchButton({}) {
  const session = await api.auth.getSession();
  console.log(session);

  const connectTwitch = async () => {
    "use server";

    if (session) {
      console.log("Already logged in");
      return;
    }

    const [url, state] = await twitchAuth.getAuthorizationUrl();
    context.cookies().set(oauthProviderStateKey.TWITCH, state, {
      httpOnly: true,
      secure: config.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    console.log(`Redirecting to [${state}] ${url.toString()}`);

    redirect(url.toString());
  };

  if (session?.user) {
    return (
      <form>
        <h2>Connected with Twitch</h2>
        <p>Connected as {session.user.username}</p>
        <button
          formAction={async () => {
            "use server";

            api.auth.logout();
          }}
        >
          Disconnect Twitch
        </button>
      </form>
    );
  }

  return (
    <form>
      <button formAction={connectTwitch}>Connect with Twitch</button>
    </form>
  );
}

