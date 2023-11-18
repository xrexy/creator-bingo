import { lucia } from 'lucia';
import { planetscale } from '@lucia-auth/adapter-mysql'
import { _connection } from './db/client';
import { env } from '../config/env';
import { nextjs, nextjs_future } from 'lucia/middleware';
import { twitch, google } from '@lucia-auth/oauth/providers';
import { omit } from "../lib/utils";

export const auth = lucia({
  adapter: planetscale(_connection as any, {
    user: 'auth_user',
    key: 'user_key',
    session: 'user_session'
  }),
  env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false
  },
  getUserAttributes: (data) => omit(data, ['id']),
})

export const twitchAuth = twitch(auth, {
  clientId: env.OAUTH_TWITCH_CLIENT_ID,
  clientSecret: env.OAUTH_TWITCH_SECRET,
  redirectUri: env.OAUTH_TWITCH_REDIRECT_URI ?? 'http://localhost:3000/api/oauth/twitch/callback'
})

export const googleAuth = google(auth, {
  clientId: env.OAUTH_GOOGLE_CLIENT_ID,
  clientSecret: env.OAUTH_GOOGLE_SECRET,
  redirectUri: env.OAUTH_GOOGLE_REDIRECT_URI ?? 'http://localhost:3000/api/oauth/google/callback',
  scope: ["https://www.googleapis.com/auth/youtube.readonly"],
  accessType: 'offline' // https://developers.google.com/identity/protocols/oauth2/web-server#offline
});

export type Auth = typeof auth;