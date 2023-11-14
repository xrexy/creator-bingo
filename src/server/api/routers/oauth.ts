import "server-only";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const oauthRouter = createTRPCRouter({
  twitch: createTRPCRouter({
    connect: publicProcedure.query(async ({ ctx: { auth, headers, context }}) => {
      console.log(context)
      const authRequest = auth.handleRequest("GET", context);
      let session = await authRequest.validate();

      console.log(session);

      if (session) {
        console.log(session);
        return 0;
      }

      const user = await auth.createUser({
        attributes: {},
        key: {
          providerId: "username",
          providerUserId: "xwexyyyyy",
          password: "idc"
        },
      })

      console.log(user);


      session = await auth.createSession({
        attributes: {},
        userId: user.userId,
      })

      console.log(session);

      authRequest.setSession(session)

      return 1;
    })
  })
})