import { drizzle as drizzleNeonPostgres } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { env } from '@/env'
import { Pool } from 'pg'
import * as schema from './schema/index'
import { neon } from '@neondatabase/serverless'

const isProduction = env.NODE_ENV === 'production'

// use neon for production, just postgres driver for development
export const db = isProduction
  ? drizzleNeonPostgres(neon(env.DATABASE_URL), { schema })
  : drizzlePostgres(
      new Pool({
        connectionString: env.DATABASE_URL
      }),
      { schema }
    )

export type DB = typeof db
