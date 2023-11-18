"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CreateUploadSheet from "./CreateUploadSheet";
import { BoardInfo } from "@/app/play/shared";
import Hint from "@/components/hint";

export type UserUploadsProps = {
  session: import("lucia").Session | null;
  creator: import("@/app/client.types").Creator | undefined;
  boards: BoardInfo[];
};

export function UserUploads({ creator, session, boards }: UserUploadsProps) {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="">
      <div className="flex justify-between w-full ">
        <h3>Your Boards</h3>
        <Sheet
          open={panelOpen}
          // onOpenChange={setPanelOpen}
        >
          {session && !creator ? (
            <Hint content="Register as a creator before creating boards.">
              <Plus size={16} />
            </Hint>
          ) : (
            <Button
              disabled={!creator || !session}
              title="Create a new board"
              onClick={() => setPanelOpen(true)}
              size="sm"
              variant="ghost"
              className="h-6 px-0 aspect-square"
            >
              <Plus size={16} />
            </Button>
          )}
          <SheetContent className="w-full xs:w-3/4">
            <CreateUploadSheet   
              creator={creator!}
              session={session!}
              boards={boards}
              onClose={() => setPanelOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {!creator || boards.length == 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show.</p>
      ) : (
        <div className="flex flex-col">
          {boards.map((board) => (
            <Link
              href={`/play/${board.resourceId}`}
              key={board.resourceId}
            >
              {board.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserUploads;

