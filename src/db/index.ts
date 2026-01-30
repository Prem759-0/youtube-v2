import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import "dotenv/config";


if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please check your .env.local file.');
}

neonConfig.fetchConnectionCache = true; // Cache connections to reduce cold starts
neonConfig.wsProxy = (host) => `${host}/v2`; // Use v2 proxy if available (check Neon docs)

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);
