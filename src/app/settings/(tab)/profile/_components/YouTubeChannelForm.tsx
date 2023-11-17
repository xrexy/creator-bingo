"use client";

import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hook";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ElementRef, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { deleteCreator as deleteCreatorAction } from "@/app/_actions/deleteCreator";
import { initOauthLogin } from "@/app/_actions/initOauthLogin";
import { FormSubmit } from "@/components/form/form-submit";
import GoogleLogo from "@/components/logo/google";
import { Label } from "@/components/ui/label";
import {
  isValidSearchParamErrorOrDefault,
  searchParamErrorMesssages,
} from "@/lib/errorMessages";

function DeleteCreatorForm({
  name,
  userId,
  channelId,
}: {
  name: string;
  channelId: string;
  userId: string;
}) {
  // re-validates /settings/profile on the server once it's complete
  const { execute: deleteCreator } = useAction(deleteCreatorAction);

  return (
    <form
      className="flex items-center gap-x-2"
      action={() => deleteCreator({ userId })}
    >
      <div className="px-3 py-2 border rounded-sm border-lime-600/75 bg-lime-600/25 w-fit ">
        <p className="text-sm font-semibold">
          Connected as{" "}
          <Link
            href={`https://www.youtube.com/channel/${channelId}`}
            referrerPolicy="no-referrer"
            className="font-semibold"
          >
            {name}
          </Link>
        </p>
      </div>
      <FormSubmit
        title="Disconnect YouTube Channel"
        className="h-full aspect-square hover:bg-red-600/50"
        variant="ghost"
      >
        <Trash size={16} />
      </FormSubmit>
    </form>
  );
}

export function YouTubeChannelForm({
  creator,
  session,
}: {
  session: import("lucia").Session | null;
  creator: import("@/app/client.types").Creator | undefined;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const error = searchParams.get("error") as string | null;

  useEffect(() => {
    if (!error) return;

    const validError = isValidSearchParamErrorOrDefault(error, "unknown");
    toast.error(searchParamErrorMesssages[validError]); // will be fired twice in dev cause of strict mode
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("error");

    router.replace(`${pathname}?${newSearchParams.toString()}`);
  }, [error, pathname, router, searchParams]);

  const inputRef = useRef<ElementRef<"input">>(null);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center">
        <div className="w-2 h-2 mt-0.5 mr-2 rounded-full bg-gray-400/40" />
        <Label htmlFor="connectWithGoogle">YouTube Channel</Label>
      </div>
      {creator ? (
        <DeleteCreatorForm
          name={creator.channelCustomUrl ?? creator.channelTitle}
          channelId={creator.channelId}
          userId={session!.user.userId}
        />
      ) : (
        <form
          className="flex flex-col w-fit gap-y-2"
          action={() => initOauthLogin("GOOGLE")}
        >
          <FormSubmit
            className="gap-x-2"
            id="connectWithGoogle"
          >
            <GoogleLogo
              height={16}
              width={16}
            />{" "}
            Connect
          </FormSubmit>
        </form>
      )}
    </div>
  );
}

