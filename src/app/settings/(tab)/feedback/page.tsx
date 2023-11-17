import { SettingsPageHeader } from "../../_components/SettingsPageHeader";

export default async function Page() {
  return (
    <>
      <SettingsPageHeader
        meta={{
          description: "Send us your feedback.",
          title: "Feedback",
        }}
      />
    </>
  );
}

