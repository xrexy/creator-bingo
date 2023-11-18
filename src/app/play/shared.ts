export type BoardInfo = {
  title: string;
  resourceId: string;
  createdAt: Date;

  publisher: {
    id: string;
    username: string;
    avatar: string;
  }
}