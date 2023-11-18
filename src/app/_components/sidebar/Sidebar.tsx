import { api } from "@/trpc/server";
import Link from "next/link";
import { Suspense } from "react";
import { CreatorsCount, SidebarUserSection } from ".";
import UserUploads from "./_components/UserUploads";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function Sidebar() {
  const session = await api.auth.getSession();
  const creator = session?.user
    ? await api.creator.getCreator({ userId: session.user.userId })
    : undefined;
  const uploads = session?.user
    ? await api.creator.getUploads({
        userId: session?.user.userId,
      })
    : [];

  return (
    <div className="lg:fixed top-0 z-20 flex w-full flex-col lg:pb-[72px] border-b border-gray-200/10 bg-black lg:bottom-0 lg:z-auto lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between w-full px-4 py-4 h-14 lg:h-auto ">
        <div className="flex items-center gap-x-2.5">
          <Link href="/">
            <svg
              width={26}
              height={26}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M8 4v1.45l2 2V4h4v4h-3.45l2 2H14v1.45l2 2V10h4v4h-3.45l2 2H20v1.45l2 2V4c0-1.1-.9-2-2-2H4.55l2 2H8zm8 0h4v4h-4V4zM1.27 1.27L0 2.55l2 2V20c0 1.1.9 2 2 2h15.46l2 2l1.27-1.27L1.27 1.27zM10 12.55L11.45 14H10v-1.45zm-6-6L5.45 8H4V6.55zM8 20H4v-4h4v4zm0-6H4v-4h3.45l.55.55V14zm6 6h-4v-4h3.45l.55.54V20zm2 0v-1.46L17.46 20H16z"
              />
            </svg>
          </Link>

          <div className="flex flex-col">
            <h3 className="font-semibold tracking-wide text-gray-400">
              Creator Bingo
            </h3>
            <Suspense
              fallback={
                <p className="text-sm text-gray-500">... creators registered</p>
              }
            >
              <CreatorsCount />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={<h3>loading...</h3>}>
          <SidebarUserSection />
        </Suspense>
      </div>

      <ScrollArea className="w-full px-4">
        <UserUploads
          creator={creator}
          session={session}
          uploads={uploads}
        />
      </ScrollArea>
    </div>
  );
}

