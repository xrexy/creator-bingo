import { OAuthRequestError } from "@lucia-auth/oauth";
import { NextRequest } from "next/server";

import env from "@/config/env";
import { oauthProviderStateKey } from "@/constants";
import { db } from "@/server/db";
import { creator as creatorTable } from "@/server/db/schema";
import { auth, googleAuth } from "@/server/lucia";

import { SearchParamError } from "@/lib/errorMessages";
import { api } from "@/trpc/server";
import { eq } from "drizzle-orm";
import * as context from 'next/headers';
import { aes256gcm, createKey } from "@/lib/utils";

type Channel = Pick<typeof creatorTable.$inferInsert, 'channelId' | 'channelTitle' | 'channelCustomUrl' | 'channelThumbnail'>

export const GET = async (req: NextRequest) => {
  const storedState = req.cookies.get(oauthProviderStateKey.GOOGLE)?.value;
  const url = new URL(req.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, { status: 400 });
  }

  try {
    const { googleTokens } = await googleAuth.validateCallback(code);
    const { accessToken: rawAccessToken, refreshToken } = googleTokens;

    const cipher = aes256gcm(createKey());
    const accessToken = cipher.encrypt(rawAccessToken);

    // console.log('google', googleUser)

    const authRequest = auth.handleRequest("GET", context);
    const session = await authRequest.validate();
    if (!session?.user) return new Response(null, { status: 401 })

    const creator = refreshToken ? await api.creator.getCreator({
      userId: session.user.userId
    }) : null
    console.log(creator);
    if (refreshToken && creator) {
      // creator already exists we just update the tokens
      try {
        await db.update(creatorTable).set({
          accessToken,
          refreshToken
        }).where(eq(creatorTable.userId, session.user.userId))

        return new Response(null, {
          status: 302,
          headers: {
            location: '/settings/tokens'
          }
        })
      } catch (e) {
        console.error(e);
        return new Response(null, {
          status: 302,
          headers: {
            location: `/settings?error=${SearchParamError.UPDATE_FAILED}`
          }
        });
      }
    }

    const url = `https://youtube.googleapis.com/youtube/v3/channels?part=id,snippet&key=${env.GOOGLE_API_KEY}&mine=true`

    const channelRes = await fetch(url, {
      headers: {
        authorization: `Bearer ${rawAccessToken}`,
        referer: env.BASE_URL,
      },
    })
      .then(res => res.json())

    const data = channelRes.items?.[0]
    if (!data || !data.snippet) {
      return new Response(null, {
        status: 302,
        headers: {
          location: `/settings/profile?error=${SearchParamError.NO_CHANNEL}`
        }
      })
    }

    const channel: Channel = {
      channelId: data.id,
      channelTitle: data.snippet.title,
      channelCustomUrl: data.snippet.customUrl,
      channelThumbnail: data.snippet.thumbnails.default.url,
    }

    const inRes = await db.insert(creatorTable).values({
      userId: session.user.userId,
      accessToken,
      refreshToken: refreshToken ? refreshToken : '',
      ...channel,
    }).onDuplicateKeyUpdate({
      set: {
        accessToken,
        ...channel,
      }
    })

    if (inRes.rowsAffected === 0) {
      return new Response(null, {
        status: 302,
        headers: {
          location: `/settings?error=${SearchParamError.INSERT_FAILED}`
        }
      });
    }

    return new Response(null, {
      status: 302,
      headers: {
        location: '/settings/profile'
      }
    })

  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      // url has been tampered with (prob invalid code)
      return new Response(null, {
        status: 302,
        headers: {
          location: `/settings?error=${SearchParamError.OAUTH_UNKOWN}`
        }
      })
    }

    return new Response(null, {
      status: 302,
      headers: {
        location: `/settings?error=${SearchParamError.UNKNOWN}`
      }
    });
  }
}