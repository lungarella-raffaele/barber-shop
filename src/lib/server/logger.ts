import { dev } from "$app/environment";
import pino from "pino";

let options: pino.LoggerOptions = {};

if (dev) {
  options = {
    level: "debug",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
    redact: [],
  };
}

export const logger = pino(options);

export function createLogger(service: string) {
  return logger.child({ service });
}
