"use server"

import { z } from "zod";

import { oauthProviders, type OAuthProvider, oauthProviderStateKey } from "@/constants";

import { createAction, createAuthAction } from "@/lib/save-action";
import { auth, googleAuth, twitchAuth } from "@/server/lucia";

import { cookies } from 'next/headers'
import { config } from "@/config";
import { RedirectType, redirect } from "next/navigation";

const urlProviders = {
  GOOGLE: googleAuth,
  TWITCH: twitchAuth,
} as const satisfies Record<OAuthProvider, unknown>

const input = z.enum(oauthProviders);

export const initOauthLogin = createAuthAction(input, async (type, { session, authRequest }) => {
  if (session?.user) {
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