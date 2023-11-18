import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import { BoardInfo } from "../shared";
import VideoPlayer from "../_components/VideoPlayer";

type PageProps = {
  params: { resourceId: string };
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = params;
  const res = await api.creator.getBoard({ resourceId });

  console.log(res);

  if (!res || res.type == "error") {
    return void redirect("/");
  }

  if (!res.data) return notFound();

  const board: BoardInfo = {
    createdAt: new Date(res.data.createdAt * 1000),
    resourceId: res.data.resourceId,
    title: res.data.title,
    publisher: {
      ...res.data.user,
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <h1>
        {board.title} - {board.createdAt.toISOString()}
      </h1>
      <pre>{JSON.stringify(board, null, 2)}</pre>
      <VideoPlayer
        board={board}
      />
    </div>
  );
}

