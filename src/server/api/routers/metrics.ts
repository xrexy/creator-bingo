import { creator } from "@/server/db/schema";
import { sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const metricRouter = createTRPCRouter({
  getTotalCreators: publicProcedure
    .query(async ({ ctx: { db } }) => {
      const query = await db.select({ c: sql<number>`count(*)` }).from(creator);
      return query[0].c;
    })

})