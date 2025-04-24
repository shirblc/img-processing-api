/**
 * Credit to jasmine-spec-reporter
 * Source: https://github.com/bcaudan/jasmine-spec-reporter/tree/master/examples/typescript
 */
import { DisplayProcessor, SpecReporter, StacktraceOption } from "jasmine-spec-reporter";

class CustomProcessor extends DisplayProcessor {
  public displayJasmineStarted(info: jasmine.JasmineStartedInfo, log: string): string {
    return `TypeScript ${log}`;
  }
}

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.PRETTY,
    },
    customProcessors: [CustomProcessor],
  }),
);
