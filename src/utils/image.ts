import sharp from "sharp";

export const ThumbFolder = "src/assets/thumb";
export const FullFolder = "src/assets/full";

/**
 * Generates the path of a resized image with its name and dimensions.
 * @param imageName - the name of the image to fetch.
 * @param height - the requested height of the image.
 * @param width - the requested width of the image.
 * @returns - a string with the path to the resized image, starting from `src/`.
 */
export function getResizedImagePath(imageName: string, height: number, width: number): string {
  return `${ThumbFolder}/${imageName}_${height}x${width}.jpg`;
}

/**
 * Resizes the given image to the given dimensions using Sharp.
 * @param imageName - the name of the image to resize.
 * @param height - the requested height of the image.
 * @param width - the requested width of the image.
 * @returns - a promise that resolves to Sharp's OutputInfo.
 */
export function resizeImageWithSharp(
  imageName: string,
  height: number,
  width: number,
): Promise<sharp.OutputInfo> {
  const imagePath = getResizedImagePath(imageName, height, width);

  return sharp(`${FullFolder}/${imageName}.jpg`).resize(width, height).toFile(imagePath);
}

/**
 * Creates a thumbnail with the given width using Sharp.
 * @param inputImagePath - the name of the image to resize.
 * @param outputImagePath - the full path for the output image.
 * @param width - the requested width of the image.
 * @returns - a promise that resolves to Sharp's OutputInfo.
 */
export function createThumbnailWithSharp(
  inputImagePath: string,
  outputPath: string,
  width: number = 360,
): Promise<sharp.OutputInfo> {
  return sharp(inputImagePath).resize(width, null).toFile(outputPath);
}
