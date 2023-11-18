import { config } from "../../config";
import { randomNumber } from ".";

export type BoardEntry = [string, string] // [key, text]

export type BoardCell = {
  entry: BoardEntry;
  checked: boolean;
}

export type Board = BoardCell[][];

/**
 * Space on the board (row, col) => can be a tuple([row, col]) or an object
 */
export type BoardSpace = { row: number, col: number } | [number, number];

const { bingoMap } = config.data
type BingoMap = typeof bingoMap;

const bingoEntries = Object.entries(bingoMap)

export const FREE_SPACE = bingoEntries[0] as ["free", string]

export const getBingoEntries = <IncludeFree extends boolean>(o?: { includeFreeSpace?: IncludeFree }): [keyof (IncludeFree extends true ? BingoMap : Omit<BingoMap, 'free'>), string][] => {
  const { includeFreeSpace = true } = o ?? {};
  return includeFreeSpace ? bingoEntries : bingoEntries.slice(1) as any;
}

export const createUncheckedEntry = (entry: BoardEntry): BoardCell => ({ entry, checked: false });

// size => size^2 => 5*5 = 25
export const generateBoard = (size = 5) => {
  const entries = getBingoEntries({ includeFreeSpace: false })

  const board: Board = [];

  const centerIdx = Math.floor(size / 2);

  const generateRow = (withFreeSpace = false) => {
    const row = [];

    if (withFreeSpace) row[centerIdx] = createUncheckedEntry(FREE_SPACE);

    let idx: number;
    for (let i = 0; i < size; i++) {
      if (row[i]) continue; // skip if already filled

      idx = randomNumber(0, entries.length - 1);
      row[i] = createUncheckedEntry(entries[idx]);

      entries.splice(idx, 1); // remove the entry from the copy
    }

    return row;
  }

  for (let i = 0; i < size; i++) {
    board[i] = generateRow(i === centerIdx);
  }

  return board;
}

export const createBoardSpace = (row: number, col: number): BoardSpace => ({ row, col });