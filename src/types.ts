export type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type NotUndefined<T> = T extends undefined ? never : T;
export type NotUndefinedDeep<T> = {
  [K in keyof T]: NotUndefined<T[K]>;
};

export type ReactSetter<T> = React.Dispatch<React.SetStateAction<T>>;