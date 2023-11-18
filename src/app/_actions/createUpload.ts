"use server"

import { actionError } from "@/lib/errorMessages";
import { createAction, createAuthAction } from "@/lib/save-action";
import { api } from "@/trpc/server";
import { z } from "zod";

const input = z.object({
  userId: z.string(),
  title: z.string(),
  videoId: z.string(),
})

export const createUpload = createAction(input, async (data) => {
  const createdId = await api.creator.createUpload(data)
  if (!createdId) return { error: { cause: actionError.UNKNOWN } } as const;
  return createdId
});