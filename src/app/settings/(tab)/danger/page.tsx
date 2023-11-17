import { SettingsPageHeader } from "../../_components/SettingsPageHeader";

export default async function Page() {
  return (
    <>
      <SettingsPageHeader
        meta={{
          description: "Dangerous actions. Be careful while navigating.",
          title: "Danger",
        }}
      />
    </>
  );
}

