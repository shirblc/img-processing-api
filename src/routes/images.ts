import { promises as fsPromise } from "node:fs";
import { resolve } from "node:path";
import Express from "express";

import { validateImageInputs } from "../utils/validation";
import { Logger } from "../utils/logger";
import { getResizedImagePath, resizeImageWithSharp } from "../utils/image";

const router = Express.Router();

/**
 * GET /images
 * @param image (string) - the name of the image to fetch
 * @param height (number | undefined) - the height to resize to
 * @param width (number | undefined) - the width to resize to
 */
router.get("/", validateImageInputs, async (req, res) => {
  const requestedImageName = req.image.name;
  const requestedHeight = req.image.height;
  const requestedWidth = req.image.width;
  const resizedImagePath = getResizedImagePath(requestedImageName, requestedHeight, requestedWidth);

  // Try to fetch the resized file
  await fsPromise
    .readFile(resizedImagePath, { encoding: "binary" })
    // If it doesn't exist, resize the original
    .catch((_error) => {
      Logger.info(`No existing file for image ${requestedImageName}. Resizing the image.`);
      return resizeImageWithSharp(requestedImageName, requestedHeight, requestedWidth);
    })
    .then((image) => {
      // If it's a string, it means it comes from readFile, so the image already existed
      // Otherwise it's Sharp's output info, which is an object
      if (typeof image === "string")
        Logger.debug(`Found existing file for ${requestedImageName}. Sending existing file.`);

      Logger.info(
        `Sending resized image ${requestedImageName} with dimensions: ${requestedHeight}x${requestedWidth}`,
      );
      res
        .setHeader("Content-Type", "image/jpeg")
        .status(200)
        .sendFile(resizedImagePath, {
          root: resolve("."),
        });
    })
    // If there was an error, alert the user
    .catch((error: Error) => {
      Logger.error(`Error: ${error.message}`);

      if (String(error).includes("file is missing"))
        res
          .status(404)
          .send(
            `Image ${requestedImageName} doesn't exist in the assets/full folder. Add it to the folder and try again.`,
          );
      else res.status(500).send(String(error));
    });
});

export default router;
