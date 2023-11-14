import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import * as data from './data';

export const env = createEnv({
  server: {
    DB_USER: z.string().min(1),
    DB_PASSWORD: z.string().startsWith('pscale_pw_'),
    DB_URL: z.string().startsWith('mysql://'),

    DB_HOST: z.string().default('aws.connect.psdb.cloud'),
    DB_NAME: z.string().default('creator-bingo'),
  },

  client: {},

  clientPrefix: "PUBLIC_",
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export const config = { env, data };