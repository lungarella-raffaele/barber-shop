import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',
	dialect: 'turso',
	dbCredentials: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		url: process.env.DATABASE_CONNECTION_URL!,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		authToken: process.env.DATABASE_AUTH_TOKEN!
	}
});
