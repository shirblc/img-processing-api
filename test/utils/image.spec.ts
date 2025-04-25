import { promises as fsPromise } from "node:fs";
import imageSize from "image-size";

import { getResizedImagePath, resizeImageWithSharp, ThumbFolder } from "../../src/utils/image";

describe("Image Utilities", () => {
  it("getResizedImagePath() - should return a path with the given image name and dimensions", () => {
    const imageName = "myimage";
    const height = 300;
    const width = 300;

    const expectedPath = `${ThumbFolder}/${imageName}_${height}x${width}.jpg`;
    const result = getResizedImagePath(imageName, height, width);

    expect(result).toEqual(expectedPath);
  });

  it("resizeImageWithSharp() - should resize the image to the given dimensions", async () => {
    const imageName = "palmtunnel";
    const height = 300;
    const width = 300;
    const expectedPath = `${ThumbFolder}/${imageName}_${height}x${width}.jpg`;
    const sharpOutput = await resizeImageWithSharp(imageName, height, width);

    expect(sharpOutput.height).toEqual(height);
    expect(sharpOutput.width).toEqual(width);

    const outputFile = await fsPromise.open(expectedPath, "r");
    const output = await outputFile.read();
    const outputDimensions = imageSize(output.buffer);

    expect(outputFile).toBeDefined();
    expect(outputDimensions.height).toEqual(height);
    expect(outputDimensions.width).toEqual(width);
    await outputFile.close();
  });
});
