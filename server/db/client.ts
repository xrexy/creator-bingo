
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'
import { config } from '../../config'

/**
 * The "raw" connection to planetscale. Beware when using this directly.
 */
export const _connection = connect({
  host: config.env.DB_HOST,
  username: config.env.DB_USER,
  password: config.env.DB_PASSWORD,
})

export const db = drizzle(_connection);

