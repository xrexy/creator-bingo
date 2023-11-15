import { config } from "@/config";
import { oauthProviderStateKey } from "@/constants";
import { twitchAuth } from "@/server/lucia";
import { api } from "@/trpc/server";

import { ArrowRightOnRectangleIcon, UserIcon } from "@heroicons/react/24/solid";

import * as context from "next/headers";

import { revalidatePath, unstable_noStore } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";

export async function SidebarUserSection() {
  unstable_noStore();

  const session = await api.auth.getSession();

  const destroySession = async () => {
    "use server";

    await api.auth.logout();
    revalidatePath("/");
  };

  const initTwitchAuthentication = async () => {
    "use server";

    if (session) {
      console.log("Already logged in");
      return;
    }

    const [url, state] = await twitchAuth.getAuthorizationUrl();
    context.cookies().set(oauthProviderStateKey.TWITCH, state, {
      httpOnly: true,
      secure: config.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60, // 1 hour
    });

    console.log(`Redirecting to [${state}] ${url.toString()}`);

    redirect(url.toString());
  };

  return (
    <div className="lg:absolute justify-center items-center inset-x-0 bottom-0 rounded-lg bg-vc-border-gradient p-px lg:h-[72px] shadow-lg shadow-black/20 z-[1]">
      <div className="flex h-full flex-row justify-between items-center w-full border-t lg:border-gray-200/10 border-transparent px-2">
        {session?.user ? (
          <div className="flex w-full lg:flex-row flex-row-reverse  justify-between gap-x-2 items-center">
            <div className="flex flex-row-reverse lg:flex-row items-center gap-x-2">
              <Image
                className="rounded-full"
                width={32}
                height={32}
                src={session.user.profilePicture}
                alt={`${session.user.username}'s picture`}
              />
              <p className="font-semibold">{session.user.username}</p>
            </div>

            <div className="flex gap-x-2">
              <a
                title="Profile"
                className="bg-gray-600/50 hover:bg-gray-700/50 transition hover:brightness-75 lg:w-8 lg:h-8 w-7 h-7 grid place-items-center rounded-lg lg:rounded-md"
                href="/profile"
              >
                <UserIcon className="w-4 aspect-square" />
              </a>
              <form>
                <button
                  title="Log out"
                  className="bg-red-600/50 hover:bg-red-700/50 lg:w-8 lg:h-8 w-7 h-7 grid place-items-center rounded-lg lg:rounded-md transition hover:brightness-75"
                  formAction={destroySession}
                >
                  <ArrowRightOnRectangleIcon className="w-4 aspect-square" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-between items-center">
            <p className="hidden lg:block font-semibold text-sm text-gray-400">Not logged in</p>

            <form>
              <button
                title="Log out"
                className="bg-indigo-600/50 hover:bg-indigo-700/50 pt-2 pb-1 px-3 border-b-2 border-r-2 border-indigo-600/50 items-center  rounded-md transition hover:brightness-75 flex flex-row gap-x-1"
                formAction={initTwitchAuthentication}
              >
                <svg
                  width={20}
                  className="aspect-square"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2L3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29l-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43Z"
                  />
                </svg>

                <span className="pb-[2px] font-bold text-sm">Login</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

