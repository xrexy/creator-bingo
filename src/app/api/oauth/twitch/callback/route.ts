import { OAuthRequestError } from "@lucia-auth/oauth";
import * as context from "next/headers";
import { NextRequest } from "next/server";

import { oauthProviderStateKey } from "@/constants";
import { auth, twitchAuth } from "@/server/lucia";
import { pick } from "@/lib/utils";

export const GET = async (req: NextRequest) => {
  const storedState = req.cookies.get(oauthProviderStateKey.TWITCH)?.value;
  const url = new URL(req.url);
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');

  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400
    });
  }

  try {
    const { getExistingUser, twitchUser, createUser } = await twitchAuth.validateCallback(code);
    console.log(twitchUser);
    const getUser = async () => {
      const existingUser = await getExistingUser();
      if(existingUser) return existingUser;
      
      return await createUser({ attributes: {
        username: twitchUser.display_name,
        profilePicture: twitchUser.profile_image_url
      }})
    }

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {}
    })

    const authRequest = auth.handleRequest(req.method, pick(context, ['headers', 'cookies']))

    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        location: '/'
      }
    })

  } catch (e) {
    console.log(e);
    if(e instanceof OAuthRequestError) {
      // url has been tampered with (prob invalid code)
      return new Response(null, { status: 400 });
    }

    return new Response(null, { status: 500 })
  }
}