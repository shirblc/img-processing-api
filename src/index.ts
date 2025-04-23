import Express from "express";
import imagesRouter from "@routes/images";

const port = 3000;
const app = Express();
app.use("/images", imagesRouter);

app.listen(port, (error) => {
  if (error) console.log("An error occurred: ", error);
  else console.log(`Server is listening on ${port}`);
});
