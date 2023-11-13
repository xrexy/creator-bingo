import { initTRPC } from "@trpc/server";

export const _t = initTRPC.create();

export const router = _t.router;
export const publicProcedure = _t.procedure;