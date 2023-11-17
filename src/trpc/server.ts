import "server-only";

import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { auth } from "@/server/lucia";

export const api = appRouter.createCaller({
  db,
  auth,

  // @ts-expect-error undefiend isn't expected but, next/headers still sucks ass
  headers: undefined,
  // headers: headers(),
});