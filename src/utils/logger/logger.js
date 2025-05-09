import { createLogger, format, transports } from "winston";
import "winston-mongodb";
import { configuration } from "../../config/env.config.js";

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({ format: format.simple() }),
    new transports.MongoDB({
      db: configuration.db.uri,
      collection: "logs",
      level: "info",
    }),
  ],
});
