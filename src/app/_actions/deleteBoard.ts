"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { ActionError } from "@/lib/errorMessages";
import { createAuthAction } from "@/lib/save-action";
import { db } from "@/server/db";
import { board } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

const input = z.object({
  resourceId: z.string()
})

export const deleteBoard = createAuthAction(input, async ({ resourceId }, { session }) => {
  if (!session) return { ok: false, error: { cause: ActionError.UNAUTHENTICATED } } as const;

  try {
    const { rowsAffected } = await db.delete(board).where(and(eq(board.resourceId, resourceId), eq(board.userId, session.user.userId)));
    if (rowsAffected === 0) return { ok: false, error: { cause: ActionError.NOTHING_CHANGED } } as const;

    revalidatePath('/settings/content')
    return { ok: true } as const;
  } catch (e) {
    return { ok: false, error: { cause: ActionError.UNKNOWN } } as const;
  }
})