"use server"

import { auth } from '@/server/lucia'
import { api } from '@/trpc/server'
import { createSafeActionClient } from 'next-safe-action'

import * as context from 'next/headers'

export const createAction = createSafeActionClient()
export const createAuthAction = createSafeActionClient({
  middleware: async () => {
    const authRequest = auth.handleRequest("GET", context);
    const session = await authRequest.validate();
    return { authRequest, session }
  }
})