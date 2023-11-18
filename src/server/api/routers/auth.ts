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
  })
})