import "server-only";

import { twitchAuth } from "@/server/lucia";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { config } from "@/config";
import { oauthProviderStateKey } from "@/constants";
import * as context from "next/headers";


export const oauthRouter = createTRPCRouter({
  twitch: createTRPCRouter({
    getAuthorizationUrl: publicProcedure.query(async ({ ctx: { auth, headers, context } }) => {
      const urlTuple = await twitchAuth.getAuthorizationUrl();
      console.log(context.cookies().getAll())
      context.cookies().set(oauthProviderStateKey.TWITCH, urlTuple[1], {
        httpOnly: true,
        secure: config.env.NODE_ENV === 'production',
        path: "/",
        sameSite: "strict",
        maxAge: 60 * 60 // 1 hour
      })

      console.log(context.cookies().getAll())

      return urlTuple;
    })
  })
})