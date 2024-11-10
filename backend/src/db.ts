import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import 'dotenv/config';

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}


export const db = drizzle(DATABASE_URL)