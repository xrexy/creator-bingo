"use client";

import {
  QuestionMarkCircleIcon,
  TrashIcon,
  XMarkIcon,
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

    // const toastId = toast(
    //   (t) => (
    //     <div className="bg-black px-4 py-2 border border-gray-200/10 rounded-md flex justify-between gap-x-6 text-center z-10">
    //       <p className="pt-1 text-gray-400 text-sm">Are you a creator?</p>
    //       <a
    //         href="/profile/creation"
    //         onClick={() => {
    //           toast.dismiss(t.id);
    //         }}
    //         className="bg-sky-400/25 border-2 px-[10px] py-1 border-sky-600/50 text-white hover:brightness-125 transition rounded-md text-[0.8rem] font-semibold"
    //       >
    //         Register here
    //       </a>
    //     </div>
    //   ),
    //   {
    //     duration: 5000,
    //     style: {
    //       background: "transparent",
    //     }
    //   }
    // );

    // rgb(2 132 199 / 0.5); sky6
    // rgb(56 189 248 / 0.25); sk64

    const toastId = toast(
      (t) => (
        <div className="flex flex-row gap-x-6 items-center">
          <p className="text-gray-400 text-sm">Are you a creator?</p>
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
  }, []);

  return <></>;
}

