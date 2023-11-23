export function shuffleStr(str: string) {
  const arr = str.split('');
  let m = arr.length;
  let t;
  let i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }

  return arr.join('');
}