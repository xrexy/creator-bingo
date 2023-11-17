import { SettingsPageHeader } from "../../_components/SettingsPageHeader";

export default async function Page() {
  return (
    <>
      <SettingsPageHeader
        meta={{
          description: "Manage your API tokens.",
          title: "Tokens",
        }}
      />
    </>
  );
}

