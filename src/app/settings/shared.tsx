export const tabs = [
  "profile",
  "content",
  "tokens",
  "feedback",
  // "danger", // not sure what to have here so will leave it out for now
] as const;
export type SettingsTab = (typeof tabs)[number];

export const defaultTab: SettingsTab = "profile";

export type SettingsPageMeta = {
  title: string;
  description: string;
};

