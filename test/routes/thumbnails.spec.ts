import supertest from "supertest";
import winston from "winston";
import { promises as fsPromise } from "node:fs";
import { resolve } from "node:path";

import { app } from "../../src/index";
import { Logger } from "../../src/utils/logger";

describe("Thumbnails Routes", () => {
  let request: supertest.Agent;
  let debugLogSpy: jasmine.Spy<winston.LogMethod>;
  let infoLogSpy: jasmine.Spy<winston.LogMethod>;
  let errorLogSpy: jasmine.Spy<winston.LogMethod>;
  const outputFolderPath = resolve("spec/images");
  const successThumbnailPath = `${outputFolderPath}/fjord.jpg`;

  beforeAll(async () => {
    request = supertest(app);
    debugLogSpy = spyOn(Logger, "debug").and.callThrough();
    infoLogSpy = spyOn(Logger, "info").and.callThrough();
    errorLogSpy = spyOn(Logger, "error").and.callThrough();
  });

  beforeEach(async () => {
    debugLogSpy.calls.reset();
    infoLogSpy.calls.reset();
    errorLogSpy.calls.reset();
    await fsPromise.rm(successThumbnailPath, { force: true });
  });

  it("should error if the source image doesn't exist", async () => {
    const inputPath = `${resolve("src/assets/full")}/kitty.jpg`;
    const response = await request
      .post("/thumbnails")
      .send({ inputImagePath: inputPath, outputFolderPath: outputFolderPath });

    expect(response.status).toBe(400);
    expect(response.body.success).toBeFalse();
    expect(response.body.message.toLowerCase()).toContain(
      `image ${inputPath.toLowerCase()} doesn't exist`,
    );
    const notFoundLog = errorLogSpy.calls
      .all()
      .find((call) => call.args[0].includes("file is missing"));

    expect(notFoundLog).toBeDefined();
  });

  it("should return an image path and 201 when creating an image", async () => {
    const inputPath = `${resolve("src/assets/full")}/fjord.jpg`;
    const response = await request
      .post("/thumbnails")
      .send({ inputImagePath: inputPath, outputFolderPath: outputFolderPath });

    expect(response.status).toBe(201);
    expect(response.body.success).toEqual(true);
    expect(response.body.outputFilePath).toEqual(successThumbnailPath);
  });

  it("should return an image path and 200 if the image was resized before", async () => {
    // ensure the file exists
    const inputPath = `${resolve("src/assets/full")}/fjord.jpg`;
    const initialResponse = await request
      .post("/thumbnails")
      .send({ inputImagePath: inputPath, outputFolderPath: outputFolderPath });

    expect(initialResponse.status).toBe(201);

    infoLogSpy.calls.reset();

    const response = await request
      .post("/thumbnails")
      .send({ inputImagePath: inputPath, outputFolderPath: outputFolderPath });

    expect(response.status).toBe(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.outputFilePath).toEqual(successThumbnailPath);

    // Jasmine seems to be having trouble spying on sharp, presumably because it's the only
    // export from the module. So we use the logger calls to check it's running through the right progression
    const noFileLog = infoLogSpy.calls
      .all()
      .find((call) => call.args[0].includes("No existing file for image"));

    expect(noFileLog).toBeUndefined();

    const existingFileLog = debugLogSpy.calls
      .all()
      .find((call) => call.args[0].includes("Found existing file for"));

    expect(existingFileLog).toBeDefined();
  });

  it("should reject a request without input image path", async () => {
    const response = await request
      .post("/thumbnails")
      .send({ inputImagePath: null, outputFolderPath: outputFolderPath });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No image path provided. Please provide the path of an image to resize and try again.",
    );
  });

  it("should reject a request without output folder path", async () => {
    const inputPath = `${resolve("src/assets/full")}/fjord.jpg`;
    const response = await request
      .post("/thumbnails")
      .send({ inputImagePath: inputPath, outputFolderPath: null });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "No output path provided. Please provide a path to output the thumbnail to and try again.",
    );
  });

  // it("should log that a new image is being generated if the image doesn't exist with the given size", async () => {
  //   const requestedImageName = "fjord";
  //   const resizedImagePath = `${ImageUtils.ThumbFolder}/${requestedImageName}_200x200.jpg`;
  //   const readSpy = spyOn(fsPromise, "readFile").and.rejectWith(Error("file doesn't exist!"));
  //   const response = await request.get(`/images?image=${requestedImageName}`);

  //   expect(response.status).toBe(200);
  //   expect(readSpy).toHaveBeenCalledWith(resizedImagePath, { encoding: "binary" });

  //   // Jasmine seems to be having trouble spying on sharp, presumably because it's the only
  //   // export from the module. So we use the logger calls to check it's running through the right progression
  //   const noFileLog = infoLogSpy.calls
  //     .all()
  //     .find((call) => call.args[0].includes("No existing file for image"));

  //   expect(noFileLog).toBeDefined();

  //   const existingFileLog = debugLogSpy.calls
  //     .all()
  //     .find((call) => call.args[0].includes("Found existing file for"));

  //   expect(existingFileLog).toBeUndefined();
  // });

  // it("should raise an error if another issue occurs", async () => {
  //   spyOn(fsPromise, "readFile").and.rejectWith(Error("file is missing!"));
  //   spyOn(ImageUtils, "resizeImageWithSharp").and.rejectWith(Error("ERROR!"));
  //   const response = await request.get(`/images?image=beepbeep`);

  //   expect(response.status).toBe(500);

  //   const errorLog = errorLogSpy.calls.all().find((call) => call.args[0].includes("Error: ERROR!"));

  //   expect(errorLog).toBeDefined();
  // });
});
