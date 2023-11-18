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
    <>
      <input type="hidden" name="videoId" value={video.id ?? ''} disabled={selected?.id !== video.id} />

      <div
        className={cn(
          "relative",
          selected?.id === video.id && "border-2 border-blue-500"
        )}
        key={video.id}
      >
        <button
          type="button"
          onClick={() => onSelected(video)}
          className="flex flex-row justify-end"
        >
          <Image
            width={320}
            height={180}
            className="object-cover rounded-md"
            src={`https://i.ytimg.com/vi/${video.resourceId}/mqdefault.jpg`}
            alt={video.title}
          />
          <Badge
            className="absolute bottom-2 left-2"
            variant="secondary"
          >
            {video.title}
          </Badge>
        </button>
      </div>
    </>
  );
}

export default VideoForm;

