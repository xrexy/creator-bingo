"use client";

import Link from "next/link";

export const settingsTabs = [ "link"] as const;

export function SettingsList() {
  return (
    <div className="flex flex-col px-2">
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