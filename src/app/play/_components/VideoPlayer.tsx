"use client";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, type YouTubeProps } from "react-youtube";
import { BoardInfo } from "../shared";
import { cn } from "@/lib/utils";

export type VideoPlayerProps = {
  board: BoardInfo;
  className?: string;
};

const stateNames = {
  "-1": "unstarted",
  "0": "ended",
  "1": "playing",
  "2": "paused",
  "3": "buffering",
  "5": "cued",
} as const;

const opts: YouTubeProps["opts"] = {
  width: "100%",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

const normalizeState = (state: number) =>
  stateNames[state as any as keyof typeof stateNames];

export function VideoPlayer({ board, className }: VideoPlayerProps) {
  const containerRef = useRef<HTMLIFrameElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [shouldUpdateTime, setShouldUpdateTime] = useState(false);
  const interval = useRef<NodeJS.Timeout | null>(null);

  const destroyTimeUpdater = () => {
    if (!interval.current) return;
    console.log("destroy");
    clearInterval(interval.current);
    interval.current = null;
  };

  const createTimeUpdater = async (e: YouTubeEvent) => {
    if (interval.current) return;
    setCurrentTime(await e.target.getCurrentTime());
    interval.current = setInterval(async () => {
      const time = await e.target.getCurrentTime();
      console.log("time", time);
      setCurrentTime(time);
    }, 1000);
  };

  useEffect(() => {
    if (!shouldUpdateTime) destroyTimeUpdater();
  }, [shouldUpdateTime]);

  useEffect(() => {
    return () => destroyTimeUpdater();
  }, []);

  return (
    <YouTube
      className={cn("", className)}
      videoId={board.resourceId}
      opts={opts}
      onStateChange={(e) => {
        const state = normalizeState(e.data);
        if (state === "playing") {
          destroyTimeUpdater();
          createTimeUpdater(e);
        } else if (state === "paused") {
          destroyTimeUpdater();
        }
      }}
      onReady={(e) => {
        setShouldUpdateTime(true);
      }}
    />
  );
}

export default VideoPlayer;

