// Every row has its own cyclic order, rather than shifting one shared sequence.
// No directed neighboring pair repeats across rows, including last -> first.
// This prevents whole stretches from matching when animation phases line up.
// Keep orders deterministic so SSR and hydration render the same photographs.
export const heroStoneRows = [
  { order: [0, 1, 2, 3, 4, 5, 6, 7], duration: 104, offset: -8 },
  { order: [1, 3, 2, 4, 7, 5, 0, 6], duration: 122, offset: -25 },
  { order: [2, 5, 3, 7, 4, 1, 6, 0], duration: 112, offset: -42 },
  { order: [3, 1, 5, 2, 7, 6, 4, 0], duration: 132, offset: -59 },
  { order: [4, 6, 2, 1, 0, 7, 3, 5], duration: 108, offset: -76 },
  { order: [5, 1, 7, 2, 0, 4, 3, 6], duration: 126, offset: -93 },
  { order: [6, 3, 0, 5, 7, 1, 4, 2], duration: 118, offset: -110 },
] as const;
