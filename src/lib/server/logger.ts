import { dev } from "$app/environment";
import pino from "pino";

const isTest = Boolean(process.env.VITEST);
const level = process.env.LOG_LEVEL ?? (isTest ? "silent" : dev ? "debug" : "info");

const options: pino.LoggerOptions = { level };

if (dev && level !== "silent") {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  };
  options.redact = [];
}

export const logger = pino(options);

export function createLogger(service: string) {
  return logger.child({ service });
}
