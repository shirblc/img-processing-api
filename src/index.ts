import Express from "express";
import imagesRouter from "./routes/images";
import { Logger, logRequest } from "./utils/logger";

export const port = 3000;
export const app = Express();
app.use("/images", imagesRouter);
app.use(logRequest);

app.listen(port, (error) => {
  if (error) Logger.error("An error occurred: ", error);
  else Logger.info(`Server is listening on ${port}`);
});
