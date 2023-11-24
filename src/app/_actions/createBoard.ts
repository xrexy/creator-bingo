"use server"

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ActionError } from "@/lib/errorMessages";
import { createAction } from "@/lib/save-action";
import { api } from "@/trpc/server";

const input = z.object({
  userId: z.string(),
  title: z.string(),
  resourceId: z.string(),
})

export const createBoard = createAction(input, async (data) => {
  const createdId = await api.creator.createBoard(data)
  if (!createdId) return { error: { cause: ActionError.UNKNOWN } } as const;

  revalidatePath(`/creator/${createdId}`)

  return createdId
});