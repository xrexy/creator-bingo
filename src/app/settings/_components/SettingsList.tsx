"use client";

import Link from "next/link";

export const settingsTabs = ["overview", "link"] as const;

export function SettingsList() {
  return (
    <div>
      {settingsTabs.map((tab) => (
        <Link
          href={`/settings/${tab}`}
          key={tab}
        >
          {tab}
        </Link>
      ))}
    </div>
  );
}

export default SettingsList; 