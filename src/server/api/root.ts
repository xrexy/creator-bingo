// https://github.com/t3dotgg/server-actions-trpc-examples/blob/d2ca6930e8887dfb593fff5c8474ac172aa522cb/src/server/api/root.ts

import "server-only";

import { oauthRouter } from "@/server/api/routers/oauth";
import { createTRPCRouter } from "@/server/api/trpc";
import { authRouter } from "./routers/auth";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  oauth: oauthRouter,
  auth: authRouter
});

// export type definition of API 
export type AppRouter = typeof appRouter;