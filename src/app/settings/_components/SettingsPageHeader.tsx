import { Tabs } from "@/components/ui/tabs";
import { SettingsPageMeta } from "../shared";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SettingsPageHeader({ meta }: { meta: SettingsPageMeta }) {
  return (
    <div className="flex flex-col space-y-1.5 pb-2">
      <h3 className="text-2xl font-semibold leading-none tracking-tight">{meta.title}</h3>
      <p className="text-sm text-muted-foreground">{meta.description}</p>
    </div>
  );
}

