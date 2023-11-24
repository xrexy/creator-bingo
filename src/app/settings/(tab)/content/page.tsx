import { api } from "@/trpc/server";
import { SettingsPageHeader } from "../../_components/SettingsPageHeader";
import { BoardPreview } from "@/app/_components/BoardPreview";
import { pick } from "@/lib/utils";

export default async function Page() {
  const session = await api.auth.getSession();
  const creator = session?.user
    ? await api.creator.getCreator({ userId: session.user.userId })
    : undefined;
  const boards = session?.user
    ? await api.creator.getBoardsWithCreator({
        userId: session?.user.userId,
      })
    : [];

  return (
    <>
      <SettingsPageHeader
        meta={{
          description: "Manage the content you've linked on the platform.",
          title: "Content",
        }}
      />

      {!session || boards.length == 0 ? (
        <p className="text-neutral-500">Nothing to show.</p>
      ) : (
        <div className="w-full">
          <p className="font-semibold">
            You have {boards.length} boards linked.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {boards.map((board) => (
              <BoardPreview
                key={board.id}
                showDelete={true}
                board={{
                  createdAt: new Date(board.createdAt * 1000),
                  publisher: { ...board.user },
                  creator: board.creator,

                  ...pick(board, ["resourceId", "title"]),
                }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

