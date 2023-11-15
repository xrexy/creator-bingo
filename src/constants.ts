export const oauthProviders  = ['TWITCH', 'GOOGLE'] as const;
export type OAuthProvider = typeof oauthProviders[number];

export const oauthProviderStateKey = Object.freeze({
  TWITCH: 'twitch_oauth_state',
  GOOGLE: 'google_oauth_state'
} satisfies Record<OAuthProvider, string>);