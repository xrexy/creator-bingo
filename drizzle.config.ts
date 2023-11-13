import type { Config } from 'drizzle-kit';
import { config } from './config';

export default {
	schema: './server/db/schema.ts',
	out: './.drizzle/migrations',
	driver: 'mysql2',
	verbose: true,
	dbCredentials: { uri: config.env.DB_URL },
} satisfies Config;