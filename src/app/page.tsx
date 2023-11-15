import { CreatorToast } from "./_components/CreatorToast";
import { TwitchButton } from "./_components/TwitchButton";

export default async function Home() {
  return (
    <main className="">
      <TwitchButton />
      <CreatorToast />
    </main>
  );
}
