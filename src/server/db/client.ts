
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'
import { env } from '../../config/env'

import * as schema from './schema'

/**
 * The "raw" connection to planetscale. Beware when using this directly.
 */
export const _connection = connect({
  host: env.DB_HOST,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
})

export const db = drizzle(_connection, { schema });
