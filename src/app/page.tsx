import { pick } from "@/lib/utils";
import { api } from "@/trpc/server";
import { CreatorToast } from "./_components/CreatorToast";
import { BoardPreview } from "./_components/BoardPreview";

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
              creator: { ...board.creator },

              ...pick(board, ["resourceId", "title"]),
            }}
          />
        ))}
      </div>

      <CreatorToast />
    </main>
  );
}

// example iframe
// <iframe
//     width="100%"
//     height="315"
//     onTimeUpdate={console.log}
//     onTimeUpdateCapture={console.log}
//     src="https://www.youtube.com/embed/CQchvFxE7WA"
//     title="It&#39;s been a year..."
//     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
//     allowFullScreen
//   ></iframe>
