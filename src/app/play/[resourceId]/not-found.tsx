"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Page(o: any) {
  const pathname = usePathname();
  return (
    <div className="h-[30svh] w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-between  w-[60%] h-full">
        <div>
          <p className="text-2xl font-bold text-center">Board not found</p>
          <p className="text-neutral-500">
            Are you sure that id{" "}
            <span className="px-1 rounded-md bg-gray-200/10">
              {pathname.split("/play/")[1]}
            </span>
            is correct?
          </p>
        </div>

        <div className="text-center ">
          <p className="font-semibold">If you followed a video id:</p>
          <p className="text-neutral-500">
            {
              "The creator hasn't created a board for this video yet, or maybe deleted it."
            }
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/">
            <Button className="text-white bg-sky-500 hover:bg-sky-600">
              Homepage
            </Button>
          </Link>

          <Link href={`https://youtube.com/watch?v=byfWscC87Vg`}>
            <Button variant="secondary">YouTube Video</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

