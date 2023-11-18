"use client";

import { Label } from "@radix-ui/react-label";

import { NoneNullDeep, YouTubeVideo } from "@/app/client.types";
import { api } from "@/trpc/react";
import { UserUploadsProps } from "./UserUploads";

import { FormSubmit } from "@/components/form/form-submit";
import { YouTubeActivity } from "@/components/logo/youtubeActivity";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SheetClose,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import VideoForm from "./VideoForm";
import { createUpload } from "@/app/_actions/createUpload";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { actionErrorMessages } from "@/lib/errorMessages";
import toast from "react-hot-toast";

export type CreateUploadSheetProps = NoneNullDeep<UserUploadsProps> & {
  onClose: () => void;
};

export function CreateUploadSheet({
  creator,
  session,
  uploads,
  onClose,
}: CreateUploadSheetProps) {
  const router = useRouter();
  const vidReq = api.creator.getYouTubeVideos.useQuery(
    {
      userId: creator.userId,
    },
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 2.5 * 60 * 1000, // 2.5 minutes
      retry: false,
    }
  );

  useEffect(() => {
    const data = vidReq.data;
    if (!data || Array.isArray(data)) return;

    toast.error(actionErrorMessages[data.error.cause]);
  }, [vidReq.data]);

  const [title, setTitle] = useState<string | undefined>(undefined);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  return (
    <>
      <SheetHeader className="text-left">
        <SheetTitle>
          <YouTubeActivity />
          Submit Video
        </SheetTitle>
        <SheetDescription>
          Select a video from your channel and submit it so other users can play
          Bingo with it.
        </SheetDescription>
      </SheetHeader>
      <form className="grid py-4">
        <Separator />

        <ScrollArea className="mt-2 h-[60vh] pr-3 w-full overflow-x-auto">
          <div className="grid grid-cols-1 gap-4 pb-4 xs:gap-2 xs:grid-cols-2">
            {!vidReq.data || vidReq.isFetching ? (
              <>
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn(
                      "w-full h-[12rem] xs:h-[6rem]",
                      i >= 2 && "hidden xs:block"
                    )}
                  />
                ))}
              </>
            ) : (
              <>
                {Array.isArray(vidReq.data) ? (
                  <>
                    {vidReq.data
                      .filter((vid) => {
                        return !uploads.some(
                          (upload) => upload.videoId === vid.resourceId
                        );
                      })
                      .map((video) => (
                        <VideoForm
                          key={video.id}
                          selected={selectedVideo}
                          onSelected={(vid) => {
                            setSelectedVideo(vid);
                            setTitle(vid.title);
                          }}
                          video={video}
                        />
                      ))}
                  </>
                ) : (
                  <p className="col-span-2 text-red-400">
                    {actionErrorMessages[vidReq.data.error.cause]}
                  </p>
                )}
              </>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="flex flex-col gap-y-4">
          <Separator />

          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="title">Card Title</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Will be auto-filled in once you select."
              className="col-span-3 text-xs"
            />
          </div>

          <SheetClose asChild>
            <FormSubmit
              formAction={async (fd) => {
                const res = await createUpload({
                  title: fd.get("title") as string,
                  videoId: fd.get("videoId") as string,
                  userId: session.user.userId,
                });

                onClose();

                router.refresh();
              }}
            >
              Submit
            </FormSubmit>
          </SheetClose>
        </div>
      </form>
    </>
  );
}

export default CreateUploadSheet;

