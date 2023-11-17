"use client";

import { useState } from "react";

import {
  type BoardCell,
  type BoardSpace,
  type Board as BoardType,
  generateBoard,
  toggleBoardEntryChecked,
} from "@/lib/utils";

export const Board= () => {
  const [board, setBoard] = useState(() => generateBoard());

  const handleCellClick = (cell: BoardCell, space: BoardSpace) => {
    console.log(cell, space);
    setBoard(toggleBoardEntryChecked(board, space));
    // re-render

    
  };

  return (
    <div className="grid gap-8 border-4 border-black aspect-square xl:max-w-[50%]">
      {board.map((row, i) => (
        <div
          className="w-full flex flex-row"
          key={i}
        >
          {row.map((cell, j) => (
            <button
              onClick={() => handleCellClick(cell, [i, j])}
              className={`w-[${100 / 5}%] border-2 ${cell.checked ? "border-lime-400" : "border-gray-500"} text-center`}
              key={j}
            >
              {cell.text}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

