"use server"

import { ActionError } from "@/lib/errorMessages";
import { createAction, createAuthAction } from "@/lib/save-action";
import { api } from "@/trpc/server";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/router";
import { z } from "zod";

const input = z.object({
  userId: z.string(),
  title: z.string(),
  resourceId: z.string(),
})

export const createUpload = createAction(input, async (data) => {
  const createdId = await api.creator.createBoard(data)
  if (!createdId) return { error: { cause: ActionError.UNKNOWN } } as const;

  revalidatePath(`/creator/${createdId}`)

  return createdId
});