import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as schema from './schema';

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

export const db = drizzle(process.env.POSTGRES_URL, { schema });
