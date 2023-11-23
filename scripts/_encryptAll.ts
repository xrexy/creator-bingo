// Encrypts all "invalid" access tokens in the database
// !! Using this script is not recommended, it's main purpose was to migrate from the old unencrypted tokens

import "dotenv/config"
import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'

import { env } from '../src/config/env'
import { aes256gcm, createKey } from "@/lib/utils";
import { creator } from "@/server/db/schema";
import { eq } from "drizzle-orm";


(async () => {
  // prompt for confirmation
  console.log('This script will encrypt all access tokens in the database. Make sure you got a backup of the database before continuing.')
  console.log('This script should only be used to migrate from the old unencrypted tokens. It is not recommended to use this script otherwise.')
  console.log('Are you sure sure sure you want to continue? (y/n)')
  const stdin = process.openStdin()
  const input = await new Promise<string>(resolve => stdin.addListener("data", (d) => resolve(d.toString().trim())))
  if (!input.toLowerCase().startsWith('y')) {
    console.log('Aborting...')
    process.exit(0)
  }
  stdin.removeAllListeners("data")

  console.log('Creating AES instance...')
  const aes = aes256gcm(createKey());

  console.log('Opening DB connection...')
  const _connection = connect({
    host: env.DB_HOST,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
  })

  console.log('Creating Drizzle instance...')
  const db = drizzle(_connection);

  const allCreators = await db.select().from(creator);
  console.log(`Migrating ${allCreators.length} creators...`)

  const sr = await Promise.allSettled(allCreators.map(async (c) => {
    const current = c.accessToken;
    if (aes.isValidToken(current)) {
      // console.log(`Skipping ${c.channelTitle}. Token is valid format`)
      throw new Error(`Token is valid format; skipping ${c.channelCustomUrl ?? c.channelTitle} (${c.id})`)
    }

    const encrypted = aes.encrypt(current);

    await db.update(creator).set({
      accessToken: encrypted
    }).where(eq(creator.id, c.id))

    console.log(`Updated ${c.channelTitle}`)
  }));

  const failed = sr.filter(r => r.status === 'rejected')
  if (failed.length > 0) {
    console.log('Migration failed. Failed res:')
    console.log((failed as PromiseRejectedResult[]).map(f => f.reason.message))
    process.exit(1)
  }

  console.log('Migration complete.')
  process.exit(0)
})();