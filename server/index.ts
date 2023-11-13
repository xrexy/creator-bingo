import { publicProcedure, router } from "./trpc";

import { schema, db } from "./db";

export const appRouter = router({
  getTests: publicProcedure.query(() => db.select().from(schema.test)
  ),
});

export type AppRouter = typeof appRouter;