import { Db } from "@/server/db/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { YouTubeVideo } from "@/app/client.types";
import { config } from "@/config";
import { upload } from "@/server/db/schema";
import { sql } from "drizzle-orm";

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

    // temp data dont wanna spam yt api
    return [
      { "id": "1", "resourceId": "hrCNEQDAIp4", "title": "BulgariaCraft SEASON IX 1" },
      { "id": "2", "resourceId": "hrCNEQDAIp4", "title": "BulgariaCraft SEASON IX 2" },
      { "id": "3", "resourceId": "hrCNEQDAIp4", "title": "BulgariaCraft SEASON IX 3" },
      { "id": "4", "resourceId": "hrCNEQDAIp4", "title": "BulgariaCraft SEASON IX 4" },
      { "id": "5", "resourceId": "hrCNEQDAIp4", "title": "BulgariaCraft SEASON IX 5" },
    ] satisfies YouTubeVideo[]

    // try {1
    //   const creator = await getCreator(db, { userId });
    //   if (!creator) return [];



    //   const { accessToken, channelId } = creator;
    //   const playlistId = `UU${channelId.slice(2)}` // channelId starts with UC, playlistId starts with UU

    //   console.log('from youtube')
    //   console.log(accessToken);
    //   const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=${maxResults}&playlistId=${playlistId}&key=${config.env.GOOGLE_API_KEY}`;
    //   const videosRes = await fetch(url, {
    //     headers: {
    //       authorization: `Bearer ${accessToken}`,
    //       referer: 'http://localhost:3000'
    //     },
    //   })
    //     .then(res => res.json())

    //   console.log(videosRes)

    //   if (videosRes.pageInfo.totalResults === 0) return [];

    //   const videos: YouTubeVideo[] = videosRes.items.map((item: any) => ({
    //     id: item.id,
    //     resourceId: item.snippet.resourceId.videoId,
    //     title: item.snippet.title,
    //     undoneThumbnail: (
    //       (thumb: string) => thumb.slice(0, thumb.lastIndexOf('/'))
    //     )(item.snippet.thumbnails.default.url)
    //   } satisfies YouTubeVideo));

    //   return videos;
    // } catch (e) {
    //   console.error(e);
    // }

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
    // return []
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

      if(uploadRes.rowsAffected === 0) throw new Error("Failed to create upload");

      return uploadRes.insertId;
    } catch (e) {
      console.error(e);
    }
  })
}) 