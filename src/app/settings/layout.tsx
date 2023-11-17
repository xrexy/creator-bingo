import { Separator } from "@/components/ui/separator";
import { SettingsLink } from "./_components/SettingsLink";
import { tabs } from "./shared";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="w-full flex gap-x-2 relative h-full min-h-[50vh]">
      <div className="flex flex-col w-[12.5%]">
        {tabs.map((tab) => (
          <SettingsLink
            key={tab}
            tab={tab}
          />
        ))}
      </div>
      <Separator
        orientation="vertical"
        className="h-auto bg-gray-200/10"
      />
      <div className="flex-1 pl-2">{children}</div>
    </div>
  );
}

