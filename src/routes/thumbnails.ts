import { promises as fsPromise } from "node:fs";
import Express from "express";

import { validateThumbnailInputs } from "../utils/validation";
import { Logger } from "../utils/logger";
import { createThumbnailWithSharp } from "../utils/image";

const router = Express.Router();

router.post("/", validateThumbnailInputs, (req, res) => {
  const originalImagePath = req.thumbnail.originalImagePath;
  const thumbnailFolderPath = req.thumbnail.outputFolderPath;
  const thumbnailPath = `${thumbnailFolderPath}/${originalImagePath.split("/").pop()}`;

  fsPromise
    .readFile(thumbnailPath as string)
    .then((_existingFile) => {
      Logger.debug(`Found existing file for ${thumbnailPath}. Sending existing file.`);
    })
    .catch((_error) => {
      Logger.error("Thumbnail not found. Creating thumbnail now.");
      return createThumbnailWithSharp(originalImagePath, thumbnailPath, 360);
    })
    .then((output) => {
      const statusCode = !output ? 200 : 201;

      res.status(statusCode).json({ success: true, outputFilePath: thumbnailPath });
    })
    // If there was an error, alert the user
    .catch((error: Error) => {
      Logger.error(`Error: ${error.message}`);

      if (String(error).includes("file is missing"))
        res.status(400).send({
          success: false,
          message: `Image ${originalImagePath} doesn't exist. Add it or fix the path and try again.`,
        });
      else res.status(500).send({ success: false, message: String(error) });
    });
});

export default router;
