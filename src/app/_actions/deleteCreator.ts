"use server"

import { ActionError } from "@/lib/errorMessages";
import { createAuthAction } from "@/lib/save-action";
import { db } from "@/server/db";
import { creator } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const input = z.object({
  userId: z.string()
})

export const deleteCreator = createAuthAction(input, async ({ userId }, { session }) => {
  if (!session) return { error: { cause: ActionError.UNAUTHENTICATED } } as const;

  try {
    const { rowsAffected } = await db.delete(creator).where(eq(creator.userId, userId));
    console.log('deleted')
    if (rowsAffected === 0) return { error: { cause: ActionError.NOTHING_CHANGED } } as const;

    revalidatePath('/settings/profile')
  } catch (e) {
    return { error: { cause: ActionError.UNKNOWN } } as const;
  }

  return;
})