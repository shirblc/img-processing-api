import Express from "express";

const port = 3000;
const app = Express();

app.listen(port, (error) => {
  if (error) console.log("An error occurred: ", error);
  else console.log(`Server is listening on ${port}`);
});
