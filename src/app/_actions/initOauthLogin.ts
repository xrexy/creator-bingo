"use server"

import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import { z } from "zod";

import { config } from "@/config";
import { oauthProviderStateKey, oauthProviders, type OAuthProvider } from "@/constants";
import { createAuthAction } from "@/lib/save-action";
import { googleAuth, twitchAuth } from "@/server/lucia";

const urlProviders = {
  GOOGLE: googleAuth,
  TWITCH: twitchAuth,
} as const satisfies Record<OAuthProvider, unknown>

const input = z.enum(oauthProviders);

export const initOauthLogin = createAuthAction(input, async (type, { session, authRequest }) => {
  if (type === 'TWITCH' && session?.user) {
    return {
      error: { cause: "ALREADY_LOGGED_IN" },
    }
  }

  const [url, state] = await urlProviders[type].getAuthorizationUrl()
  cookies().set(oauthProviderStateKey[type], state, {
    httpOnly: true,
    secure: config.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60,
  })

  console.log(`Received ${type} OAUTH redirecting to: ${url.toString()}`);

  redirect(url.toString());

  return [url.toString(), state]
})