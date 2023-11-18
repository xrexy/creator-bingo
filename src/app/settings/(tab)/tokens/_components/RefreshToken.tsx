import { Creator } from "@/app/client.types";
import { Label } from "@/components/ui/label";
import { Session } from "lucia";
import RefreshTokenForm from "./RefreshTokenForm";
import Hint from "@/components/hint";

export type RefreshTokenProps = {
  session: Session;
  creator: Creator | undefined;
};

export function RefreshToken({ creator, session }: RefreshTokenProps) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center gap-x-1">
        <Hint content="Manually update your refresh token. Refresh tokens are used when fetching YouTube specific data." />
        <Label htmlFor="refreshToken">Refresh Token</Label>
      </div>
      {creator ? (
        <RefreshTokenForm
          creator={creator}
          userId={session.user.userId}
        />
      ) : (
        <p className="text-sm text-red-400">
          Link your channel to access this.
        </p>
      )}
    </div>
  );
}

export default RefreshToken;

