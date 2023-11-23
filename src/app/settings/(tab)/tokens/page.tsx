import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

import { api } from "@/trpc/server";

import { SettingsPageHeader } from "../../_components/SettingsPageHeader";
import Hint from "@/components/hint";

export default async function Page() {
  const session = await api.auth.getSession();
  const creator = session
    ? await api.creator.getCreator({ userId: session.user.userId })
    : undefined;

  return (
    <>
      <SettingsPageHeader
        meta={{
          description: "Why and how are we storing your tokens.",
          title: "Tokens",
        }}
      />

      <div className="flex flex-col items-start gap-1 text-neutral-500">
        <h3 className="pb-2 text-lg font-semibold text-white">
          YouTube Access Token
        </h3>
        <Hint
          side="right"
          content="
            The access token is needed for us to be able to query your YouTube uploads. 
            If you're not a creator you dont need to link it.
          "
          description="Why do we need it?"
        />
        <Hint
          side="right"
          content="The access token is encrypted using our 'AES 256 GCM' algorithm and stored together with it's refresh token."
          description="How is it stored?"
        />
        {/* implement opting out(prob deleting creator account. But would be kinda dumb if all boards are deleted as well) */}
      </div>

      {/* {session?.user ? (
        <RefreshToken
          creator={creator}
          session={session}
        />
      ) : (
        <p>You have to be logged in to access this page.</p>
      )} */}
    </>
  );
}

