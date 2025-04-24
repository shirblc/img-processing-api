import supertest from "supertest";
import { imageSize } from "image-size";
import winston from "winston";
import { promises as fsPromise } from "node:fs";

import { app } from "../../src/index";
import { Logger } from "../../src/utils/logger";

describe("Images Routes", () => {
  let request: supertest.Agent;
  let debugLogSpy: jasmine.Spy<winston.LogMethod>;
  let infoLogSpy: jasmine.Spy<winston.LogMethod>;
  let errorLogSpy: jasmine.Spy<winston.LogMethod>;

  beforeAll(async () => {
    request = supertest(app);
    debugLogSpy = spyOn(Logger, "debug").and.callThrough();
    infoLogSpy = spyOn(Logger, "info").and.callThrough();
    errorLogSpy = spyOn(Logger, "error").and.callThrough();
  });

  beforeEach(() => {
    debugLogSpy.calls.reset();
    infoLogSpy.calls.reset();
    errorLogSpy.calls.reset();
  });

  it("should error if the source image doesn't exist", async () => {
    const response = await request.get("/images?image=robot");

    expect(response.status).toBe(404);
    expect(response.text.toLowerCase()).toContain("image robot doesn't exist");
    const notFoundLog = errorLogSpy.calls
      .all()
      .find((call) => call.args[0].includes("file is missing"));

    expect(notFoundLog).toBeDefined();
    expect(notFoundLog?.args[0]).toContain("src/assets/full/robot.jpg");
  });

  it("should return an image with the default size of 200x200 if no size is provided", async () => {
    const response = await request.get("/images?image=icelandwaterfall");

    expect(response.status).toBe(200);
    const responseImageSize = imageSize(response.body);

    expect(responseImageSize.height).toEqual(200);
    expect(responseImageSize.width).toEqual(200);
  });

  it("should return an image with the given size if height and width are given", async () => {
    const height = 300;
    const width = 300;
    const response = await request.get(
      `/images?image=icelandwaterfall&height=${height}&width=${width}`,
    );

    expect(response.status).toBe(200);
    const responseImageSize = imageSize(response.body);

    expect(responseImageSize.height).toEqual(height);
    expect(responseImageSize.width).toEqual(width);
  });

  it("should return an existing image if the image with the given sizes was resized before", async () => {
    // ensure the file exists
    await request.get("/images?image=icelandwaterfall");

    infoLogSpy.calls.reset();

    const response = await request.get("/images?image=icelandwaterfall");

    expect(response.status).toBe(200);

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

  it("should log that a new image is being generated if the image doesn't exist with the given size", async () => {
    const requestedImageName = "fjord";
    const resizedImagePath = `src/assets/thumb/${requestedImageName}_200x200.jpg`;
    const readSpy = spyOn(fsPromise, "readFile").and.rejectWith(Error("file doesn't exist!"));
    const response = await request.get(`/images?image=${requestedImageName}`);

    expect(response.status).toBe(200);
    expect(readSpy).toHaveBeenCalledWith(resizedImagePath, { encoding: "binary" });

    // Jasmine seems to be having trouble spying on sharp, presumably because it's the only
    // export from the module. So we use the logger calls to check it's running through the right progression
    const noFileLog = infoLogSpy.calls
      .all()
      .find((call) => call.args[0].includes("No existing file for image"));

    expect(noFileLog).toBeDefined();

    const existingFileLog = debugLogSpy.calls
      .all()
      .find((call) => call.args[0].includes("Found existing file for"));

    expect(existingFileLog).toBeUndefined();
  });

  it("should reject a request without an image name", async () => {
    const response = await request.get(`/images?height=400&width=400`);

    expect(response.status).toBe(400);
    expect(response.text).toBe("Image name is required");
  });
});
