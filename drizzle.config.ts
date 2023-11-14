import type { Config } from 'drizzle-kit';
import { env } from './src/config/env';

export default {
	schema: './src/server/db/schema.ts',
	out: './.drizzle/migrations',
	driver: 'mysql2',
	verbose: true,
	dbCredentials: { uri: env.DB_URL },
} satisfies Config;