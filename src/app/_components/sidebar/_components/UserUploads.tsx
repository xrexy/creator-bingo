"use client";

import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import CreateUploadSheet from "./CreateUploadSheet";
import { createUpload } from "@/app/_actions/createUpload";

export type UserUploadsProps = {
  session: import("lucia").Session | null;
  creator: import("@/app/client.types").Creator | undefined;
  // TODO just copy-pasted the type, find a way to externalize it
  uploads: {
    id: number;
    title: string;
    userId: string;
    videoId: string;
    createdAt: number;
    user: {
      id: string;
      username: string;
      profilePicture: string;
    };
  }[];
};

export function UserUploads({ creator, session, uploads }: UserUploadsProps) {
  return (
    <div className="">
      <div className="flex justify-between w-full ">
        <h3>Your Uploads</h3>
        <Sheet onOpenChange={console.log}>
          <SheetTrigger asChild>
            <Button
              disabled={!creator || !session}
              size="sm"
              variant="ghost"
              className="h-6 px-0 aspect-square"
            >
              <Plus size={16} />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <CreateUploadSheet
              creator={creator!}
              session={session!}
              uploads={uploads}
            />
          </SheetContent>
        </Sheet>
      </div>

      {!creator || uploads.length == 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show.</p>
      ) : (
        <>
          {uploads.map((upload) => (
            <p key={upload.id}>{upload.title}</p>
          ))}
        </>
      )}
    </div>
  );
}

export default UserUploads;

