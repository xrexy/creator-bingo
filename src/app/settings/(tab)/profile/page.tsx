import { api } from "@/trpc/server";
import { YouTubeChannelForm } from "./_components/YouTubeChannelForm";
import { SettingsPageHeader } from "../../_components/SettingsPageHeader";

export default async function SettingsLinkTabPage() {
  const session = await api.auth.getSession();
  const creator = session
    ? await api.creator.getCreator({ userId: session.user.userId })
    : undefined;

  return (
    <div>
      <SettingsPageHeader
        meta={{
          description: "General personalization settings",
          title: "Profile",
        }}
      />
      <YouTubeChannelForm
        session={session}
        creator={creator}
      />
    </div>
  );
}

