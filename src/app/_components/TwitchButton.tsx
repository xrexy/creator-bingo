import { api } from "@/trpc/server";

export function TwitchButton({}) {
  const connectTwitch = async () => {
    "use server"
    const connectRes = await api.oauth.twitch.connect();
  
    console.log(connectRes)
  }

  return (
    <form>
      <button formAction={connectTwitch}>Connect with Twitch</button>
    </form>
  );
}
