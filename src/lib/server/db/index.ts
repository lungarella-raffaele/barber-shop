import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { DBLogger } from './db-logger';
import { logger as pinoLogger } from '../logger';
import { DefaultLogger } from 'drizzle-orm';

config({ path: '.env' });

const logger = new DefaultLogger({
	writer: new DBLogger(pinoLogger)
});
export const db = drizzle({
	connection: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		url: process.env.DATABASE_CONNECTION_URL!,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		authToken: process.env.DATABASE_AUTH_TOKEN!
	},
	logger
});
