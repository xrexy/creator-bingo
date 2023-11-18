import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { YouTubeVideo } from "@/app/client.types";
import { config } from "@/config";
import { ActionError, ActionErrorKeys, ActionErrorType } from "@/lib/errorMessages";
import { Db, db } from "@/server/db/client";
import { creator as creatorTable, upload } from "@/server/db/schema";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { get } from "http";

const getUpload = (db: Db, userId: string) => db.query.upload.findMany({
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

// https://accounts.google.com/signin/oauth/v2/consentsummary?authuser=1&part=AJi8hAOq9jywp57sgGbrcwJeVTNLZhSF5VSczT2g3eFI4U6xf5SgTFw8g752ZwZc3KjX3WvrOZyWyA0KNcbqIcU21l65h-3MP8BfTwTsfc_JHz6m_NMEUTkawuqvDmg-NmiHoqERtHHxtG0MLA5nOSH_jQb4SPvZrVGrqd4wn8Ys5JfW33a2R7nxBAFJD3pqV1WcIx0aYw2weWQp47gFll94FsjjXtutsi867-2Wq1zwcgE3JBF7jFXO68IfdZwjEGyD7Y3n3WRxN597UmwLQYy357ZWrMOesRsdG3EijM3sdKrB4eSDklVEMpZf32ySDZux8WL_DdZLb7HaUde4nJxTmnkjXwwZKafHwe8kJrw5dD4ge3vU55UOhDsQxbdsIBdSeDrSZ0Xz1heqNwd-GB0TnZ8lddEmF_B7E0Sxi0uCemfjnE-MDioCQWkjcYcWVgasM-iTyZIclwNRIok0sWFnBnv9Bh0MPgKJPx_PMuz6NECSK4rufqDQJC10UAhqfzDFlEx40Wpgjn4Y9lKTB8GKmn7dlsik1Mnlp_MZCqQtGVuw2RQDxxbgb1dam_AMtaFsObf9TkjiVNPe0Vg5IxLD25H6OqDldozP7JYD-Axg9xJNPCFQF6vQKulVEmXk89fvJKWLBM9iWen8uN-B_Q6ptptixJSDXMjdKfT10qgVmzCZJCS2t-6w7p_NF_Edu3y8DBsBUtY8m6mszLuZ9B0N_jiT2mSQqpDkYv5Gz3CE3gUAFYztMhh6LuKFjjyB9wRy_DD0VMDjma0ISiqe-0h0-tQOg7Z8Pw&hl=en&as=S1493841654%3A1700318910261434&client_id=595314327256-03r6atn71hm7fke2tp66bgtcgmdr8m86.apps.googleusercontent.com&rapt=AEjHL4OFAQ20--dZM1felu86yYRZxDcPpI75WcfOvhpatjy5tc3tkTThT-OEiYQ8dxehXToKx8_rRL2zdhUN6nt8q6_FMS5Eaw&theme=glif

  if (videosRes.error) {
    if (videosRes.error.code === 401 && videosRes.error.message.startsWith('Request had invalid authentication credentials.')) {
      console.log('invalid token, trying to refresh')
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

      await db.update(creatorTable).set({
        accessToken: refreshRes.access_token
      }).where(eq(creatorTable.userId, userId))

      // retry with new access token
      return getYouTubeVideosInternal({ ...o, refreshToken: refreshRes.refresh_token })
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
  getUploads: publicProcedure.input(z.object({
    userId: z.string(),
  })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const { userId } = input;

    try {
      return await getUpload(db, userId)
    } catch (e) {
      console.error(e);
    }

    return []
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

      console.log(creator);

      return getYouTubeVideosInternal({ accessToken, userId, refreshToken: creator.refreshToken, maxResults, playlistId })
    } catch (e) {
      console.error(e);
    }

    return []
  }),
  createUpload: publicProcedure.input(z.object({
    userId: z.string(),
    title: z.string(),
    videoId: z.string(),
  })).query(async ({ ctx, input }) => {
    const { db } = ctx;
    const { userId, title, videoId } = input;

    try {
      const creator = await getCreator(db, { userId });
      if (!creator) throw new Error("Creator not found");

      const { id } = creator;
      const uploadRes = await db.insert(upload).values({
        createdAt: sql`UNIX_TIMESTAMP()`,
        userId,
        title,
        videoId
      });

      if (uploadRes.rowsAffected === 0) throw new Error("Failed to create upload");

      return uploadRes.insertId;
    } catch (e) {
      console.error(e);
    }
  })
}) 