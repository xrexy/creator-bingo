export const tabs = [
  "profile",
  "content",
  "tokens",
  "feedback",
  "danger",
] as const;
export type SettingsTab = (typeof tabs)[number];

export const defaultTab: SettingsTab = "profile";

export type SettingsPageMeta = {
  title: string;
  description: string;
};
