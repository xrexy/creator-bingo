import { oauthProviders } from "../constants";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const generateOAuthConfigs = (providers: typeof oauthProviders): {
  [key in `OAUTH_${(typeof providers)[number]}_CLIENT_ID`]: z.ZodString
} & {
  [key in `OAUTH_${(typeof providers)[number]}_SECRET`]: z.ZodString
} & {
  [key in `OAUTH_${(typeof providers)[number]}_REDIRECT_URI`]?: z.ZodOptional<z.ZodString>
} => {
  const result = {} as any;
  for (const provider of providers) {
    result[`OAUTH_${provider}_CLIENT_ID`] = z.string().min(1);
    result[`OAUTH_${provider}_SECRET`] = z.string().min(1);
    result[`OAUTH_${provider}_REDIRECT_URI`] = z.string().optional();
  }
  return result;
}

const a = z.string().optional()

export const env = createEnv({
  server: {
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().startsWith('pscale_pw_'),
    DB_URL: z.string().startsWith('mysql://'),

    DB_HOST: z.string().default('aws.connect.psdb.cloud'),
    DB_NAME: z.string().default('creator-bingo'),

    ...generateOAuthConfigs(oauthProviders),
    GOOGLE_API_KEY: z.string().min(1),

    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  },

  client: {},

  runtimeEnv: process.env,

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  clientPrefix: "PUBLIC_",
  emptyStringAsUndefined: true,
});

export default env;