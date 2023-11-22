import {
  type BingoBoard as BingoBoardType,
  BoardCell,
  makeBoardLocation,
  BoardLocation,
} from "@/lib/utils";
import {
  MutableRefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import BingoCell from "./BingoCell";

export type BingoBoardProps = {
  bingoBoard: BingoBoardType;
};

function isSameLocation(l1: BoardLocation, l2: BoardLocation): boolean {
  return l1[0] === l2[0] && l1[1] === l2[1];
}

function BingoBoardComponent({ bingoBoard }: BingoBoardProps) {
  const [selectedLocations, setSelectedLocations] = useState<BoardLocation[]>(
    []
  );

  // these location functions seem dumb idk might refactor if they ever become too laggy
  function addLocation(location: BoardLocation) {
    setSelectedLocations((prev) => [...prev, location]);
  }

  function removeLocation(location: BoardLocation) {
    setSelectedLocations((prev) =>
      prev.filter((loc) => !isSameLocation(loc, location))
    );
  }

  function toggleLocation(location: BoardLocation) {
    if (selectedLocations.some((loc) => isSameLocation(loc, location))) {
      removeLocation(location);
    } else {
      addLocation(location);
    }
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
              isSelected={selectedLocations.some((location) =>
                isSameLocation(location, [rowIdx, cellIdx])
              )}
              id={`${rowIdx}-${cellIdx}`}
              onSelected={() => toggleLocation([rowIdx, cellIdx])}
              key={`${rowIdx}-${cellIdx}`}
              cell={cell}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export const BingoBoard = memo(BingoBoardComponent);

export default BingoBoard;

