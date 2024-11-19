import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/db/schema.ts', // Output directory for generated schema files
  out: './src/db/',           // Output directory for generated code
  dialect: 'postgresql',              // Database driver
  dbCredentials: {
    url: process.env.DATABASE_URL || ''
  },
} satisfies Config;
