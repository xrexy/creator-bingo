import { BoardCell, BoardLocation, cn } from "@/lib/utils";

export type BingoCellProps = {
  cell: BoardCell;
  id: string;
  isSelected: boolean;
  onSelected: () => void;
};

export function BingoCell({
  cell: {
    entry: [, text],
  },
  id,
  isSelected,
  onSelected,
}: BingoCellProps) {
  return (
    <button
      onClick={() => onSelected()}
      className={cn(
        "w-[20%] h-full border text-xs p-1",
        isSelected
          ? "border-green-500/25 bg-green-400/10"
          : "border-gray-600/25 bg-gray-400/10"
      )}
    >
      {text}
    </button>
  );
}

export default BingoCell;

