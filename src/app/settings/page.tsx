
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  redirect("/settings/link");
  return <></>
}

