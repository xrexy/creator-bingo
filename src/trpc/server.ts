import "server-only"; // Make sure you can't import this on client

import { headers } from "next/headers";
import { appRouter } from "@/server/api/root";
import { db } from "@/server/db";
import { auth } from "@/server/lucia";

export const api = appRouter.createCaller({
  db,
  auth,
  headers: headers()
});