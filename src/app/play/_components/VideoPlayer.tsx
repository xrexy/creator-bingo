"use client";
import { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, type YouTubeProps } from "react-youtube";
import { BoardInfo } from "../shared";

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

const opts: YouTubeProps["opts"] = {
  height: "390",
  width: "640",
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 1,
  },
};

const normalizeState = (state: number) =>
  stateNames[state as any as keyof typeof stateNames];

export function VideoPlayer({ board }: VideoPlayerProps) {
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
    console.log("create");
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
    <>
      <h1>
        {!!interval.current ? "y" : "n"} {shouldUpdateTime ? "y" : "n"}
        {currentTime}
      </h1>
      <YouTube
        videoId={board.resourceId}
        opts={opts}
        onStateChange={(e) => {
          const state = normalizeState(e.data);
          console.log("state", state);
          if (state === "playing") {
            destroyTimeUpdater();
            createTimeUpdater(e);
          } else if (state === "paused") {
            destroyTimeUpdater()
          }
        }}
        onReady={(e) => {
          setShouldUpdateTime(true);
        }}
      />
    </>
  );
}

export default VideoPlayer;

