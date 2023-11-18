"use client";
import { useEffect, useRef, useState } from "react";
import { BoardInfo } from "../shared";
import YouTube, { YouTubeProps } from "react-youtube";
import { on } from "events";

export type VideoPlayerProps = {
  board: BoardInfo;
};

const stateNames = {
  "-1": "unstarted",
  "0": "ended",
  "1": "playing",
  "2": "paused",
  "3": "buffering",
  "5": "cued",
} as const;

const normalizeState = (state: number) =>
  stateNames[state as any as keyof typeof stateNames];

export function VideoPlayer({ board }: VideoPlayerProps) {
  const containerRef = useRef<HTMLIFrameElement>(null);

  const [currentTime, setCurrentTime] = useState(0);

  let interval: NodeJS.Timeout | null = null;

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    if (interval) return;

    interval = setInterval(async () => {
      const time = await event.target.getCurrentTime();
      setCurrentTime(time);
    }, 1000);
  };

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  useEffect(() => {
    return () => {
      if (!interval) return;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>{currentTime}</h1>
      <YouTube
        videoId={board.resourceId}
        opts={opts}
        onReady={onPlayerReady}
      />
    </>
  );
}

export default VideoPlayer;

