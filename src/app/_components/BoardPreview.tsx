"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Creator } from "../client.types";
import { BoardInfo } from "../play/shared";
import { TrashIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "../_actions/deleteBoard";
import { FormSubmit } from "@/components/form/form-submit";
import toast from "react-hot-toast";

export type BoardPreviewProps = {
  board: BoardInfo & { creator: Creator | undefined };
  showDelete?: boolean;
};

const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation();
};

function DeleteAction({
  resourceId,
  title,
}: {
  resourceId: string;
  title: string;
}) {
  return (
    <form
      action={() => {
        const execution = (async () => {
          const res = await deleteBoard({ resourceId });
          if (!res.data?.ok) {
            console.log(res.data);
            throw new Error("Failed to delete");
          }

          return res;
        })();
        toast.promise(
          execution,
          {
            loading: "Deleting...",
            success: `Deleted ${title}!`,
            error:
              "Failed to delete. Please try again, and if the problem persists, contact support.",
          },
          {
            position: "top-center",
          }
        );
      }}
    >
      <FormSubmit
        onClick={stopPropagation}
        size="icon"
        variant="ghost"
      >
        <TrashIcon
          height={16}
          width={16}
        />
      </FormSubmit>
    </form>
  );
}

export function BoardPreview({ board, showDelete }: BoardPreviewProps) {
  const { resourceId, creator, title } = board;

  const router = useRouter();

  const navigateToBoard = () => {
    router.push(`/play/${resourceId}`);
  };

  return (
    <button
      onClick={navigateToBoard}
      className="flex flex-col gap-2 transition border-2 rounded-md group hover:border-sky-400/50 border-gray-200/10"
    >
      {/* only here for prefetching */}
      <Link href={`/play/${resourceId}`}>
        <Image
          src={`https://i.ytimg.com/vi/${resourceId}/mqdefault.jpg`}
          alt="thumbnail"
          className="object-cover w-full h-full brightness-90 group-hover:brightness-100"
          width={320}
          height={180}
        />
      </Link>

      <div className="flex w-full gap-2 p-2">
        <div className="pt-1">
          {creator ? (
            <Image
              src={creator.channelThumbnail}
              alt="avatar"
              className="object-cover rounded-full"
              width={32}
              height={32}
            />
          ) : (
            <UserGroupIcon />
          )}
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-start flex-1 ">
            <h3 className="font-semibold ">{title}</h3>
            {creator ? (
              <a
                className="text-sm text-sky-400"
                referrerPolicy="no-referrer"
                target="_blank"
                href={`https://youtube.com/channel/${creator.channelId}`}
                onClick={stopPropagation}
              >
                {creator.channelCustomUrl ?? creator.channelTitle}
              </a>
            ) : (
              <p className="text-sm text-sky-400">Deleted</p>
            )}
          </div>
          {showDelete && (
            <DeleteAction
              title={title}
              resourceId={resourceId}
            />
          )}
        </div>
      </div>
    </button>
  );
}

