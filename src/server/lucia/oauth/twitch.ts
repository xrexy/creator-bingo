import { twitch } from '@lucia-auth/oauth/providers'
import { auth } from '..'
import { config } from '@/config'

export const twitchAuth = twitch(auth, {
  clientId: config.env.OAUTH_TWITCH_CLIENT_ID,
  clientSecret: config.env.OAUTH_TWITCH_SECRET,
  redirectUri: config.env.OAUTH_TWITCH_REDIRECT_URI ?? 'http://localhost:3000/api/auth/oauth/twitch/callback'
})