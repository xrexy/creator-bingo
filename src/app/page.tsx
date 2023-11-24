import { pick } from "@/lib/utils";
import { api } from "@/trpc/server";
import { BoardPreview } from "./_components/BoardPreview";
import { CreatorToast } from "./_components/CreatorToast";

export default async function Home() {
  const latestBoards = await api.creator.getRecentBoards();

  return (
    <main>
      <h1 className="text-lg font-semibold">Recent Boards</h1>

      <div className="grid grid-cols-3 gap-4">
        {latestBoards.map((board) => (
          <BoardPreview
            key={board.id}
            board={{
              createdAt: new Date(board.createdAt * 1000),
              publisher: { ...board.user },
              creator: board.creator,

              ...pick(board, ["resourceId", "title"]),
            }}
          />
        ))}
      </div>

      <CreatorToast />
    </main>
  );
}
