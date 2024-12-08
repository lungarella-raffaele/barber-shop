// import { defineConfig } from 'drizzle-kit';
// if (!process.env.TURSO_CONNECTION_URL) throw new Error('DATABASE_URL is not set');

// export default defineConfig({
// 	schema: './src/lib/server/db/schema.ts',
// 	out: './migrations',
// 	dialect: 'sqlite',
// 	dbCredentials: {
// 		url: process.env.TURSO_CONNECTION_URL!,
// 		authToken: process.env.TURSO_AUTH_TOKEN!
// 	}
// });

import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	out: './migrations',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.TURSO_CONNECTION_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!
	}
});
