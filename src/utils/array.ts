import { randomNumber } from ".";

export const shuffle = <T>(arr: T[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const randomEntry = <T>(arr: T[]): T => {
  const idx = randomNumber(0, arr.length - 1);
  return arr[idx];
}