import { OAuthRequestError } from "@lucia-auth/oauth";
import { NextRequest } from "next/server";

import env from "@/config/env";
import { oauthProviderStateKey } from "@/constants";
import { db } from "@/server/db";
import { creator } from "@/server/db/schema";
import { auth, googleAuth } from "@/server/lucia";

import * as context from 'next/headers'

export const GET = async (req: NextRequest) => {
  const storedState = req.cookies.get(oauthProviderStateKey.GOOGLE)?.value;
  const url = new URL(req.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, { status: 400 });
  }

  try {
    const { getExistingUser, googleUser, googleTokens, createUser } = await googleAuth.validateCallback(code);
    const { accessToken } = googleTokens;

    const authRequest = auth.handleRequest("GET", context);
    const session = await authRequest.validate();
    if (!session) return new Response(null, { status: 401 })

    const url = `https://youtube.googleapis.com/youtube/v3/channels?part=id,snippet&key=${env.GOOGLE_API_KEY}&mine=true`

    const channel = await fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
        referer: 'http://localhost:3000'
      },
    })
      .then(res => res.json())
      .then(res => {
        const data = res.items[0]
        if (!data || !data.snippet) throw new Error('no channel found')

        return {
          channelId: data.id,
          channelTitle: data.snippet.title,
          channelCustomUrl: data.snippet.customUrl,
          channelThumbnail: data.snippet.thumbnails.default.url
        }
      })

    const inRes = await db.insert(creator).values({
      userId: session.user.userId,
      accessToken,
      ...channel,
    }).onDuplicateKeyUpdate({
      set: {
        accessToken,
        ...channel,
      }
    })

    if(inRes.rowsAffected === 0) throw new Error('failed to insert')

    return new Response(null, {
      status: 302,
      headers: {
        location: '/profile'
      }
    })

  } catch (e) {
    console.error(e);
    if (e instanceof OAuthRequestError) {
      // url has been tampered with (prob invalid code)
      return new Response(null, { status: 400 });
    }

    if (e instanceof Error && e.message === 'no channel found') {
      return new Response(null, { status: 400 })
    }

    return new Response(null, { status: 500 })
  }
}