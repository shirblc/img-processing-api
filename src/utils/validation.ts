import { Request, Response, NextFunction } from "express";

import { Logger } from "./logger";

const defaultHeight = 200;
const defaultWidth = 200;

/**
 * Validates the inputs to the GET /images endpoint and converts
 * the numeric inputs to numbers.
 * @param req the incoming request
 * @param res the outgoing response
 * @param next the next middleware in the chain
 */
export function validateImageInputs(req: Request, res: Response, next: NextFunction): void {
  const requestedImageName = req.query.image as string | undefined;
  if (!requestedImageName) {
    Logger.error("Invalid request: Image name is required");
    res.status(400).send("Image name is required");
  }

  let requestedHeight = Number(req.query.height as string | undefined);
  let requestedWidth = Number(req.query.width as string | undefined);

  if (!requestedHeight) {
    Logger.warn(
      `No requested height for image ${requestedImageName}. Setting the default ${defaultHeight}.`,
    );
    requestedHeight = defaultHeight;
  }

  if (!requestedWidth) {
    Logger.warn(
      `No requested width for image ${requestedImageName}. Setting the default ${defaultWidth}.`,
    );
    requestedWidth = defaultWidth;
  }

  req.image = {
    name: requestedImageName as string,
    height: requestedHeight,
    width: requestedWidth,
  };

  next();
}
