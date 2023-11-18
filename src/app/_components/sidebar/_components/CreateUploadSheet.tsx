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
import { useState } from "react";
import VideoForm from "./VideoForm";
import { createUpload } from "@/app/_actions/createUpload";
import { useRouter } from "next/navigation";

export type CreateUploadSheetProps = NoneNullDeep<UserUploadsProps>;

export function CreateUploadSheet({
  creator,
  session,
  uploads,
}: CreateUploadSheetProps) {
  const router = useRouter();
  const vidReq = api.creator.getYouTubeVideos.useQuery(
    {
      userId: creator.userId,
    },
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 2.5 * 60 * 1000, // 2.5 minutes
    }
  );

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
      <form
        action={async (fd) => {
          const res = await createUpload({
            title: fd.get("title") as string,
            videoId: fd.get("videoId") as string,
            userId: session.user.userId,
          });

          router.refresh();
        }}
        className="grid py-4"
      >
        <Separator />

        {!vidReq.data || vidReq.isFetching ? (
          // TODO skeletons
          <p className="text-muted">Loading...</p>
        ) : (
          <ScrollArea className="mt-2 whitespace-nowrap h-[60vh] pr-3 w-full overflow-x-auto">
            <div className="grid grid-cols-1 gap-4 pb-4 xs:gap-2 xs:grid-cols-2">
              {vidReq.data.map((video) => (
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
            </div>

            <ScrollBar orientation="vertical" />
          </ScrollArea>
        )}

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
            <FormSubmit>Submit</FormSubmit>
          </SheetClose>
        </div>
      </form>
    </>
  );
}

export default CreateUploadSheet;

