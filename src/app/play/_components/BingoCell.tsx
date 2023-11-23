import { BoardCell, BoardLocation, cn } from "@/lib/utils";

export type BingoCellProps = {
  cell: BoardCell;
  isSelected: boolean;
  hasWon: boolean;
  onSelected: () => void;
};

export function BingoCell({
  cell: {
    entry: [, text],
  },
  hasWon,
  isSelected,
  onSelected,
}: BingoCellProps) {
  return (
    <button
      onClick={() => onSelected()}
      className={cn(
        "w-[20%] h-full border text-xs p-1",
        isSelected
          ? // TODO dont mark all as "won" tiles, mark only the ones that are part of the winning set
            hasWon
            ? "border-green-500/25 bg-green-400/10"
            : "border-sky-400/25 bg-sky-300/10"
          : "border-gray-600/25 bg-gray-400/10"
      )}
    >
      {text}
    </button>
  );
}

export default BingoCell;

