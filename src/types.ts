export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type NotUndefined<T> = T extends undefined ? never : T;