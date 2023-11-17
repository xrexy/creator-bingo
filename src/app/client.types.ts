export type Creator = {
  id: number;
  userId: string;
  accessToken: string;
  channelTitle: string;
  channelId: string;
  channelCustomUrl: string | null;
  channelThumbnail: string;
};

export type NoneNull<T> = T extends null | undefined ? never : T;
export type NoneNullDeep<T> = {
  [K in keyof T]: NoneNull<T[K]>;
};