import "server-only";

import { lucia } from 'lucia';
import { planetscale } from '@lucia-auth/adapter-mysql'
import { _connection } from './db/client';
import { env } from '../config/env';
import { nextjs, nextjs_future } from 'lucia/middleware';
import { twitch } from '@lucia-auth/oauth/providers';

export const TABLE_NAMES = Object.freeze({
  user: 'auth_user',
  key: 'user_key',
  session: 'user_session'
})

export const auth = lucia({
  adapter: planetscale(_connection as any, TABLE_NAMES),
  env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false
  },
  getUserAttributes(data) {
    console.log('received user attributes', data)
    return {
      username: data.username
    }
  }
})

export const twitchAuth = twitch(auth, {
  clientId: env.OAUTH_TWITCH_CLIENT_ID,
  clientSecret: env.OAUTH_TWITCH_SECRET,
  redirectUri: env.OAUTH_TWITCH_REDIRECT_URI ?? 'http://localhost:3000/api/oauth/twitch/callback'
})

export type Auth = typeof auth;