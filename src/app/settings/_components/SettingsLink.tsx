"use client";

import Link from "next/link";

import { capitalize, cn } from "@/lib/utils";
import { SettingsTab } from "../shared";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function SettingsLink({ tab }: { tab: SettingsTab }) {
  const pathname = usePathname();
  const selectedTab = pathname.split("/")[2];

  return (
    <Link
      className={cn(
        "w-full group-hover:text-white",
        selectedTab === tab ? "text-sky-400" : "text-gray-400"
      )}
      href={`/settings/${tab}`}
      key={tab}
    >
      <Button
        variant="ghost"
        className={cn(
          "group w-full",
          // tab === "danger" ? "hover:bg-red-600/50" : undefined
        )}
      >
        {capitalize(tab)}
      </Button>
    </Link>
  );
}

