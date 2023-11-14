import "server-only";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { createTracing } from "trace_events";

export const oauthRouter = createTRPCRouter({
  twitch: createTRPCRouter({
    connect: publicProcedure.query(async ({ctx: {auth, }, }) => {
      const session = await auth.handleRequest()
    })
  })
})