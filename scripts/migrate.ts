import "dotenv/config"
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, _connection } from '@/server/db/client';

(async () => {
  console.log('Migrating database...');
  
  try {
    await migrate(db as any, { migrationsFolder: './.drizzle/migrations' });
  } catch (err) {
    console.log('Migration failed.', err);
    process.exit(1);
  }

  console.log('Migration complete.')
})()