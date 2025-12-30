import Express, { json } from "express";
import imagesRouter from "./routes/images";
import thumbnailsRouter from "./routes/thumbnails";
import { Logger, logRequest } from "./utils/logger";

export const port = 3000;
export const app = Express();
app.use(json());
app.use(logRequest);
app.use("/images", imagesRouter);
app.use("/thumbnails", thumbnailsRouter);

app.listen(port, (error) => {
  if (error) Logger.error("An error occurred: ", error);
  else Logger.info(`Server is listening on ${port}`);
});
