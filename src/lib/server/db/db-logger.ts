import pino from 'pino';
import { type LogWriter } from 'drizzle-orm/logger';

export class DBLogger implements LogWriter {
	private logger: pino.Logger;

	constructor(logger: pino.Logger) {
		this.logger = logger;
	}

	write(message: string) {
		this.logger.debug(message);
	}
}
