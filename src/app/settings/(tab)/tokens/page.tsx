import { SettingsPageHeader } from "../../_components/SettingsPageHeader";

export default async function Page() {
  return (
    <>
      <SettingsPageHeader
        meta={{
          description: "Regenerate your API tokens.",
          title: "Tokens",
        }}
      />
    </>
  );
}

