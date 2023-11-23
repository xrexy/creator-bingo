"use client";

import { Creator } from "@/app/client.types";
import { type BingoBoard as BingoBoardType, generateBoard } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { BoardInfo } from "../shared";
import VideoPlayer from "./VideoPlayer";
import BingoBoard from "./BingoBoard";

export type GameProps = {
  board: BoardInfo;
  creator: Creator;
};

function Player({ board }: { board: BoardInfo }) {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="w-[50%] h-fit ">
      <VideoPlayer
        updateTime={setCurrentTime}
        board={board}
      />
    </div>
  );
}

export function Game({ board, creator }: GameProps) {
  const [bingoBoard, setBingoBoard] = useState<BingoBoardType>([]);

  useEffect(() => {
    setBingoBoard(generateBoard(board.resourceId));
  }, [board.resourceId]);

  return (
    <div className="flex w-full gap-x-2">
      <Player board={board} />
      <div className="flex-1 min-h-[30rem]">
        <BingoBoard
          resourceId={board.resourceId}
          bingoBoard={bingoBoard}
        />
      </div>
    </div>
  );
}

export default Game;

