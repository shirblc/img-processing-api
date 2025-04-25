import { Request, Response, NextFunction } from "express";
import winston from "winston";

import { Logger } from "../../src/utils/logger";
import { validateImageInputs } from "../../src/utils/validation";

describe("Validation Utils", () => {
  let res: Partial<Response>;
  let nextFn: NextFunction;
  let warnLogSpy: jasmine.Spy<winston.LogMethod>;
  let errorLogSpy: jasmine.Spy<winston.LogMethod>;

  beforeAll(() => {
    warnLogSpy = spyOn(Logger, "warn").and.callThrough();
    errorLogSpy = spyOn(Logger, "error").and.callThrough();
  });

  beforeEach(() => {
    res = {
      status(code) {
        return {
          statusCode: code,
          send(body) {
            res.statusMessage = JSON.stringify({ statusCode: code, statusMessage: body });
            return { statusCode: code, statusMessage: body } as Response;
          },
        } as Response;
      },
    };
    nextFn = () => undefined;
    warnLogSpy.calls.reset();
    errorLogSpy.calls.reset();
  });

  it("validateImageInputs() - should throw an error if the request doesn't contain an image name", () => {
    const request: Partial<Request> = {
      query: {},
    };

    validateImageInputs(request as Request, res as Response, nextFn);

    expect(errorLogSpy.calls.first().args[0]).toEqual("Invalid request: Image name is required");
    expect(res.statusMessage).toEqual(
      JSON.stringify({ statusCode: 400, statusMessage: "Image name is required" }),
    );
  });

  it("validateImageInputs() - should log a warning if there's no height", () => {
    const request: Partial<Request> = {
      query: {
        image: "myimage",
      },
    };

    validateImageInputs(request as Request, res as Response, nextFn);

    expect(warnLogSpy.calls.first().args[0]).toEqual(
      "No valid requested height for image myimage. Setting the default 200.",
    );
  });

  it("validateImageInputs() - should log a warning if there's no width", () => {
    const request: Partial<Request> = {
      query: {
        image: "myimage",
        height: "100",
      },
    };

    validateImageInputs(request as Request, res as Response, nextFn);

    expect(warnLogSpy.calls.first().args[0]).toEqual(
      "No valid requested width for image myimage. Setting the default 200.",
    );
  });
});
