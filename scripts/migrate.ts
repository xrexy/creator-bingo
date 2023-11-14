import "dotenv/config"
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'

import { env } from '../src/config/env'

(async () => {
  try {
    console.log('Opening DB connection...')
    const _connection = connect({
      host: env.DB_HOST,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
    })

    console.log('Creating Drizzle instance...')
    const db = drizzle(_connection);

    console.log('Migrating database...');
    await migrate(db as any, { migrationsFolder: './.drizzle/migrations' });
  } catch (err) {
    console.log('Migration failed.', err);
    process.exit(1);
  } finally {
    console.log('Migration complete.')
  }
})()