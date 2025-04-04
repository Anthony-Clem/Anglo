import "dotenv/config";
import cors from "cors";
import express from "express";
import { conifg } from "./config/env.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./config/http.config";

const app = express();
const port = conifg.PORT;
const basePath = conifg.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get(`${basePath}`, (req, res) => {
  res.sendStatus(HTTPSTATUS.OK);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${conifg.NODE_ENV}`);
});
