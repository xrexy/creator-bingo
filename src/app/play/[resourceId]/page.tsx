import { api } from "@/trpc/server";
import { notFound, redirect } from "next/navigation";
import Game from "../_components/Game";
import { BoardInfo } from "../shared";

type PageProps = {
  params: { resourceId: string };
};

export default async function Page({ params }: PageProps) {
  const { resourceId } = params;
  const res = await api.creator.getBoard({ resourceId });

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

  const creator = await api.creator.getCreator({
    userId: board.publisher.id,
  });

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[0.5ch]">
          <h1 className="text-lg font-bold">{board.title}</h1>
          <span className="text-neutral-500">by</span>
          {creator ? (
            <a
              className="text-sky-400"
              target="_blank"
              referrerPolicy="no-referrer"
              href={`https://youtube.com/channel/${creator.channelId}`}
            >
              {creator.channelCustomUrl ?? creator.channelTitle}
            </a>
          ) : (
            <p className="text-sky-400">Deleted</p>
          )}
        </div>
        <a
          className="text-sky-400"
          target="_blank"
          referrerPolicy="no-referrer"
          href={`https://youtube.com/watch?v=${board.resourceId}`}
        >
          Source
        </a>
      </div>

      <Game
        board={board}
        creator={creator}
      />
    </div>
  );
}

