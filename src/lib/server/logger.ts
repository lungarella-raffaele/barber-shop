import pino from 'pino';
import { dev, browser } from '$app/environment';

let options: pino.LoggerOptions = {};

if (dev) {
	options = {
		level: 'debug',
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true
			}
		},
		redact: []
	};
}
export const logger = pino(options);
