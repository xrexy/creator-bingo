import { db } from "@/server/db";
import { createTRPCContext, createTRPCRouter, publicProcedure } from "../trpc";
import { sql } from "drizzle-orm";
import { creator } from "@/server/db/schema";

export const metricRouter = createTRPCRouter({
  getTotalCreators: publicProcedure
    .query(async ({ ctx: { db } }) => {
      const query = await db.select({ c: sql<number>`count(*)` }).from(creator);
      return query[0].c;
    })

})