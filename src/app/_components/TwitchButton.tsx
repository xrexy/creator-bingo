"use client";

import Image from "next/image";
import { FormEventHandler } from "react";
import { useAction } from "next-safe-action/hook";

import { api } from "@/trpc/react";
import { initOauthLogin } from "../_actions/initOauthLogin";
import toast from "react-hot-toast";

export function TwitchButton({}) {
  const query = api.auth.getSession.useQuery();
  const { execute, result, status } = useAction(initOauthLogin);

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    execute("TWITCH");
  };

  if (query.data?.user) {
    const { user } = query.data;
    return (
      <form>
        <h2>Connected with Twitch</h2>
        <p onClick={() => toast.success('kur')}>Connected as {user.username}</p>
        <Image
          className="rounded-full"
          width={64}
          height={64}
          src={user.profilePicture}
          alt="Profile picture"
        />
      </form>
    );
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <button type="submit">Connect with Twitch</button>
      </form>
    </div>
  );
}

