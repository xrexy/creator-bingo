import { BoardLocation, type BingoBoard as BingoBoardType } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import BingoCell from "./BingoCell";

export type BingoBoardProps = {
  bingoBoard: BingoBoardType;
  resourceId: string;
};

function isSameLocation(l1: BoardLocation, l2: BoardLocation): boolean {
  return l1[0] === l2[0] && l1[1] === l2[1];
}

const setKeys = Object.freeze([
  // rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],

  // columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],

  // diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
]);

export function BingoBoard({ bingoBoard, resourceId }: BingoBoardProps) {
  // i hate have a separate state for this but I really dont want to convert board to a useState... seems like an even worse idea
  const [activeLocations, setActiveLocations] = useState<BoardLocation[]>([]);

  const [hasWon, setHasWon] = useState(false);
  const board = useRef(bingoBoard);

  const scoreGame = useCallback(() => {
    const sets = buildSets();

    const scores = sets.map((set) => set.filter((cell) => cell.checked).length);

    return scores.some((score) => score === 5);
  }, []);

  useEffect(() => {
    if (activeLocations.length === 0) return;

    // save activeLocations in localstorage
    localStorage.setItem(
      `bingo-al-${resourceId}`,
      JSON.stringify(activeLocations)
    );
  }, [resourceId, activeLocations]);

  useEffect(() => {
    // load activeLocations from localstorage
    const savedLocations = localStorage.getItem(`bingo-al-${resourceId}`);

    if (board.current.length === 0) board.current = [...bingoBoard];
    if (!savedLocations || board.current.length === 0) return;

    const locations = JSON.parse(savedLocations) as BoardLocation[];

    board.current = board.current.map((row, rowIdx) =>
      row.map((cell, colIdx) => ({
        ...cell,
        checked: locations.some((loc) => isSameLocation(loc, [rowIdx, colIdx])),
      }))
    );

    setActiveLocations(locations);
    setHasWon(scoreGame());
  }, [resourceId, bingoBoard, scoreGame]);

  // these location functions seem dumb idk might refactor if they ever become too laggy
  function addLocation(location: BoardLocation) {
    setActiveLocations((prev) => [...prev, location]);
  }

  function removeLocation(location: BoardLocation) {
    setActiveLocations((prev) =>
      prev.filter((loc) => !isSameLocation(loc, location))
    );
  }

  function toggleLocation(location: BoardLocation) {
    const { checked } = board.current[location[0]][location[1]];

    if (checked) removeLocation(location);
    else addLocation(location);

    board.current[location[0]][location[1]].checked = !checked;
  }

  function buildSets() {
    const flatBoard = board.current.flat();
    return setKeys.map((keys) => keys.map((key) => flatBoard[key]));
  }

  return (
    <div className="grid w-full h-full grid-rows-5">
      {bingoBoard.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="flex flex-row w-full"
        >
          {row.map((cell, cellIdx) => (
            <BingoCell
              isSelected={activeLocations.some((location) =>
                isSameLocation(location, [rowIdx, cellIdx])
              )}
              hasWon={hasWon}
              onSelected={() => {
                toggleLocation([rowIdx, cellIdx]);
                const isWin = scoreGame();

                if (!hasWon && isWin)
                  toast.success("Bingo!", {
                    icon: "🎉",
                    position: "top-center",
                    duration: 2.5 * 1000,
                  });

                setHasWon(isWin);
              }}
              key={`${rowIdx}-${cellIdx}`}
              cell={cell}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default BingoBoard;

