import { config } from "@/config";
import { randomNumber } from ".";

export type BoardCell = {
  text: string;
  checked: boolean;
}

export type Board = BoardCell[][];

/**
 * Space on the board (row, col) => can be a tuple([row, col]) or an object
 */
export type BoardSpace = { row: number, col: number } | [number, number];

const { bingoEntries } = config.data

export const FREE_SPACE = bingoEntries[0];

export const getBingoEntries = (o?: { includeFreeSpace?: boolean }) => {
  const { includeFreeSpace = true } = o ?? {};
  return includeFreeSpace ? bingoEntries : bingoEntries.slice(1);
}

export const stringToBoardEntry = (text: string): BoardCell => ({ text, checked: false });

// size => size^2 => 5*5 = 25
export const generateBoard = (size = 5) => {
  const entries = getBingoEntries({ includeFreeSpace: false })
  const board: Board = [];

  const centerIdx = Math.floor(size / 2);

  const generateRow = (withFreeSpace = false) => {
    const row = [];

    if (withFreeSpace) row[centerIdx] = stringToBoardEntry(FREE_SPACE);

    let idx: number;
    for (let i = 0; i < size; i++) {
      if (row[i]) continue; // skip if already filled

      idx = randomNumber(0, entries.length - 1);
      row[i] = stringToBoardEntry(entries[idx]);

      entries.splice(idx, 1); // remove the entry from the copy
    }

    return row;
  }

  for (let i = 0; i < size; i++) {
    board[i] = generateRow(i === centerIdx);
  }

  return board;
}

export const entryInput = (row: number, col: number): BoardSpace => ({ row, col });

export const toggleBoardEntryChecked = (board: Board, entry: BoardSpace) => {
  const { row, col } = Array.isArray(entry) ? { row: entry[0], col: entry[1] } : entry;

  const boardEntry = board?.[row]?.[col];

  if(boardEntry) boardEntry.checked = !boardEntry.checked;

  return board;
}

export const toggleBoardEntryCheckedMultiple = (board: Board, entries: BoardSpace[]) => {
  entries.forEach(entry => toggleBoardEntryChecked(board, entry));
}