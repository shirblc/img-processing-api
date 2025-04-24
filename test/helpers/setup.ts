import { promises as fsPromise } from "node:fs";
import { resolve } from "node:path";

/** Copy the initial images so we can use them in tests */
const rootPath = resolve(".");
fsPromise
  .cp(`${rootPath}/src/assets`, `${rootPath}/spec/src/assets`, { recursive: true })
  .catch((error) => console.log(error));
