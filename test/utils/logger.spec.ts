import { Request, Response, NextFunction } from "express";

import { Logger, logRequest } from "../../src/utils/logger";
import winston from "winston";

describe("Logger Utils", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let nextFn: NextFunction;
  let debugLogSpy: jasmine.Spy<winston.LogMethod>;
  let infoLogSpy: jasmine.Spy<winston.LogMethod>;

  beforeAll(() => {
    debugLogSpy = spyOn(Logger, "debug").and.callThrough();
    infoLogSpy = spyOn(Logger, "info").and.callThrough();
  });

  beforeEach(() => {
    req = {
      url: "http://localhost:3000/beep",
      query: {
        search: "hi",
      },
      body: {
        search: "hi",
      },
    };
    res = {};
    nextFn = () => undefined;
    debugLogSpy.calls.reset();
    infoLogSpy.calls.reset();
  });

  it("logRequest() - should log the incoming url", () => {
    logRequest(req as Request, res as Response, nextFn);

    expect(infoLogSpy.calls.all().length).toEqual(1);
    expect(infoLogSpy.calls.all()[0].args[0]).toEqual(`Incoming request to path: ${req.url}`);
  });

  it("logRequest() - should log the request's query parameters", () => {
    logRequest(req as Request, res as Response, nextFn);

    expect(debugLogSpy.calls.all().length).toEqual(2);
    expect(debugLogSpy.calls.all()[0].args[0]).toEqual(
      `Request query parameters: ${JSON.stringify(req.query)}`,
    );
  });

  it("logRequest() - should log the request's body", () => {
    logRequest(req as Request, res as Response, nextFn);

    expect(debugLogSpy.calls.all().length).toEqual(2);
    expect(debugLogSpy.calls.all()[1].args[0]).toEqual(`Request body: ${JSON.stringify(req.body)}`);
  });
});
