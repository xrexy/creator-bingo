import SettingsList from "./_components/SettingsList";


type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div>
      <SettingsList />
      <div className="h-full w-[1px] bg-gray-200/10" />
    </div>
  );
}

