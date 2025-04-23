import { Request, Response, NextFunction } from "express";
import { createLogger, format, transports } from "winston";

const logLevelColours = {
  debug: "cyan",
  info: "green",
  warn: "yellow",
  error: "red",
};

const consoleLogFormatter = format.printf((message) => {
  return `[${message.timestamp}] ${message.level}: ${message.message}`;
});

export const Logger = createLogger({
  level: "debug",
  format: format.timestamp(),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize({ level: true, colors: logLevelColours }),
        consoleLogFormatter,
      ),
    }),
    new transports.File({
      filename: "combined.log",
      format: format.json(),
    }),
  ],
});

/**
 * Basic logging middleware for Express. Logs the requested path, as well as
 * the request's query parameter and body (when log level is set to debug).
 * @param req the incoming request
 * @param _res the outgoing response
 * @param next the next middleware in the chain
 */
export function logRequest(req: Request, _res: Response, next: NextFunction): void {
  Logger.info(`Incoming request to path: ${req.url}`);
  Logger.debug(`Request query parameters: ${JSON.stringify(req.query)}`);
  Logger.debug(`Request body: ${JSON.stringify(req.body)}`);

  next();
}
