import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

import * as context from "next/headers";

export const authRouter = createTRPCRouter({
  getSession: publicProcedure.query(({ ctx: { auth } }) => {
    const authRequest = auth.handleRequest("GET", context);
    return authRequest.validate();
  }),
  logout: publicProcedure.query(async ({ ctx: { auth } }) => {
    const authRequest = auth.handleRequest("GET", context);
    const session = await authRequest.validate();
    
    if (!session) return new Response(null, { status: 401 });

    await auth.invalidateSession(session.sessionId);
    authRequest.setSession(null);

    return new Response(null, {
      status: 302,
      headers: {
        location: '/'
      }
    })
  }),
  getCreator: publicProcedure.input(z.object({
    userId: z.string().optional(),
    channelTitle: z.string().optional(),
  })).query(({ ctx: { db }, input }) => {
    // at least one should be provided
    if (!input.userId && !input.channelTitle) {
      throw new Error("Must provide either userId or channelTitle");
    }

    return db.query.creator.findFirst({
      where: (c, { eq }) => input.channelTitle ? eq(c.channelTitle, input.channelTitle) : eq(c.userId, input.userId!),
    })
  })
})