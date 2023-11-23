"use client";

import {
  TrashIcon
} from "@heroicons/react/24/solid";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export function CreatorToast() {
  unstable_noStore()
  const creatorToastIsHidden = typeof window !== 'undefined' ? localStorage.getItem("creatorToastIsHidden") : null;

  useEffect(() => {
    if (creatorToastIsHidden && creatorToastIsHidden === "true") return;

    const toastId = toast(
      (t) => (
        <div className="flex flex-row items-center gap-x-6">
          <p className="text-sm text-gray-400">Are you a creator?</p>
          <div className="flex items-center gap-x-2">
            <Link
              className="bg-sky-400/25 border-2 px-2 py-1 border-sky-600/50 text-white hover:brightness-125 transition rounded-md text-[0.8rem] font-semibold"
              href="/profile/creator"
            >
              Register
            </Link>
            <button
              className="bg-red-400/25 border-2 px-2 py-1 border-red-600/50 text-white hover:brightness-125 transition rounded-md text-[0.8rem] font-semibold"
              onClick={() => {
                toast.dismiss(t.id)
                localStorage.setItem("creatorToastIsHidden", "true");
              }}
            >
              <TrashIcon
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      ),
      {
        // icon: (
        //   <QuestionMarkCircleIcon
        //     width={20}
        //     height={20}
        //     className="text-gray-200/50"
        //   />
        // ),
      }
    );

    // so it's shown once on dev
    if (toastId !== "1") {
      toast.dismiss(toastId);
    }
  }, [creatorToastIsHidden]);

  return <></>;
}

