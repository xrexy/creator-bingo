"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

import { YouTubeVideo } from "@/app/client.types";
import { cn } from "@/lib/utils";

export type VideoFormProps = {
  video: YouTubeVideo;
  selected: YouTubeVideo | null;
  onSelected: (video: YouTubeVideo) => void;
};

export function VideoForm({ video, selected, onSelected }: VideoFormProps) {
  return (
    <div className="col-span-1">
      <input type="hidden" name="resourceId" value={video.resourceId ?? ''} disabled={selected?.id !== video.id} />

      <div
        className={cn(
          "border-2 rounded-md border-gray-200/10 flex  flex-col gap-x-2",
          selected?.id === video.id && "border-blue-500"
        )}
        key={video.id}
      >
        <button
          type="button"
          onClick={() => onSelected(video)}
          className="flex flex-row justify-end h-full"
        >
          <Image
            width={320}
            height={180}
            className="object-cover w-full h-full rounded-md"
            src={`https://i.ytimg.com/vi/${video.resourceId}/mqdefault.jpg`}
            alt={video.title}
          />
        </button>
      </div>
        <h5 className="text-xs">{video.title}</h5>
    </div>
  );
}

export default VideoForm;

