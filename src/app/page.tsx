import { CreatorToast } from "./_components/CreatorToast";
import { TwitchButton } from "./_components/TwitchButton";

export default async function Home() {
  return (
    <main className="">
      <h1 className="text-lg font-semibold">Homepage</h1>
      <CreatorToast />
    </main>
  );
}
