import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { YouTubeVideo } from "@/app/client.types";
import { config } from "@/config";
import { ActionError, ActionErrorType } from "@/lib/errorMessages";
import { Db, db } from "@/server/db/client";
import { creator as creatorTable, board } from "@/server/db/schema";

import { createTRPCRouter, publicProcedure } from "../trpc";

import * as context from 'next/headers'

const getBoards = (db: Db, userId: string) => db.query.board.findMany({
  where: (u, { eq }) => eq(u.userId, userId),
  with: {
    user: true
  }
})

const getCreator = (db: Db, {
  userId,
  channelTitle
}: {
  userId?: string,
  channelTitle?: string
}) => db.query.creator.findFirst({
  where: (c, { eq }) => channelTitle ? eq(c.channelTitle, channelTitle) : eq(c.userId, userId!),
  with: {
    user: true
  }
})

const getYouTubeVideosInternal = async (o:
  { accessToken: string, userId: string, refreshToken: string | null, maxResults: number, playlistId: string }
): Promise<YouTubeVideo[] | { error: { cause: ActionErrorType['NO_REFRESH_TOKEN'] } }> => {
  const { accessToken, maxResults, playlistId, refreshToken, userId } = o;

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=${maxResults}&playlistId=${playlistId}&key=${config.env.GOOGLE_API_KEY}`;
  const videosRes = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`,
      referer: 'http://localhost:3000'
    },
  })
    .then(res => res.json())

  if (videosRes.error) {
    if (videosRes.error.code === 401 && videosRes.error.message.startsWith('Request had invalid authentication credentials.')) {
      console.log(`invalid token, trying to refresh with ${refreshToken}`)
      if (!refreshToken) return { error: { cause: ActionError.NO_REFRESH_TOKEN } }

      // TODO handle if refresh token has expired https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
      const url = `https://oauth2.googleapis.com/token?client_id=${config.env.OAUTH_GOOGLE_CLIENT_ID}&client_secret=${config.env.OAUTH_GOOGLE_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`;
      const refreshRes = await fetch(url, {
        method: 'POST',
        headers: {
          referer: 'http://localhost:3000'
        },
      })
        .then(res => res.json())

      console.log(refreshRes)

      const newToken = refreshRes.access_token;

      await db.update(creatorTable).set({
        accessToken: newToken
      }).where(eq(creatorTable.userId, userId))

      return getYouTubeVideosInternal({ ...o, refreshToken: newToken })
    }

    console.error(videosRes.error);
    return [];
  }

  if (videosRes.pageInfo.totalResults === 0) return [];

  return videosRes.items.map((item: any) => ({
    id: item.id,
    resourceId: item.snippet.resourceId.videoId,
    title: item.snippet.title,

    /** thumbnail uri can be constructed with https://i.ytimg.com/vi/${resourceId}/${thumbnailType}.jpg
    * 
    * https://i.ytimg.com/vi/YOUTUBE_ID/maxresdefault.jpg
    * |=> https://i.ytimg.com/vi/YOUTUBE_ID
    * 
    * @example /default.jpg (120x90px)
    * @example /mqdefault.jpg (320x180px)
    * @example /hqdefault.jpg (480x360px)
    * @example /sddefault.jpg (640x480px)
    * @example /maxresdefault.jpg (1280x720px)
    */
  } satisfies YouTubeVideo));
}

export const creatorRouter = createTRPCRouter({
  getCreator: publicProcedure.input(z.object({
    userId: z.string().optional(),
    channelTitle: z.string().optional(),
  })).query(({ ctx, input }) => {
    const { db } = ctx;

    // at least one should be provided
    if (!input.userId && !input.channelTitle) {
      throw new Error("Must provide either userId or channelTitle");
    }

    return getCreator(db, input)
  }),
  getRecentBoards: publicProcedure.input(z.object({
    limit: z.number().default(12),
  }).default({})).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const { limit } = input ?? {};

    try {
      return await db.query.board.findMany({
        orderBy: [desc(board.createdAt)],
        limit,
        with: {
          user: true,
          creator: true,
        }
      })
    } catch (e) {
      console.error(e);
    }

    return []
  }),
  getBoards: publicProcedure.input(z.object({
    userId: z.string(),
  })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const { userId } = input;

    try {
      return await getBoards(db, userId)
    } catch (e) {
      console.error(e);
    }

    return []
  }),
  getBoard: publicProcedure.input(z.object({
    resourceId: z.string(),
    userId: z.string().optional(),
  })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const { resourceId, userId } = input;

    const authRequest = ctx.auth.handleRequest("GET", context);
    const session = userId ? await authRequest.validate() : null;

    if (userId && !session?.user) return { type: "error", cause: ActionError.UNAUTHENTICATED } as const;

    try {
      const board = await db.query.board.findFirst({
        where: (u, { eq, and }) => userId ? and(eq(u.userId, session!.user.userId), eq(u.resourceId, resourceId)) : eq(u.resourceId, resourceId),
        with: {
          user: true
        }
      })

      return { type: "data", data: board } as const;
    } catch (e) {
      console.error(e);
      return { type: "error", cause: ActionError.UNKNOWN } as const;
    }
  }),
  getYouTubeVideos: publicProcedure.input(z.object({
    userId: z.string(),
    maxResults: z.number().default(20),
  })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const { userId, maxResults } = input;

    try {
      const creator = await getCreator(db, { userId });
      if (!creator) return [];

      const { accessToken, channelId } = creator;
      const playlistId = `UU${channelId.slice(2)}` // channelId starts with UC, playlistId starts with UU

      const res = await getYouTubeVideosInternal({ accessToken, userId, refreshToken: creator.refreshToken, maxResults, playlistId })
      return res;
    } catch (e) {
      console.error(e);
    }

    return []
  }),
  createUpload: publicProcedure.input(z.object({
    userId: z.string(),
    title: z.string(),
    resourceId: z.string(),
  })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const { userId, title, resourceId } = input;

    try {
      const creator = await getCreator(db, { userId });
      // TODO see if this kills everything VERY optimistic atm
      if (!creator) throw new Error("Creator not found");

      const { id } = creator;
      const uploadRes = await db.insert(board).values({
        createdAt: sql`UNIX_TIMESTAMP()`,
        userId,
        title,
        resourceId
      });

      if (uploadRes.rowsAffected === 0) throw new Error("Failed to create board");

      return uploadRes.insertId;
    } catch (e) {
      console.error(e);
    }
  })
}) 