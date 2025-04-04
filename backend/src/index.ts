import "dotenv/config";
import cors from "cors";
import express from "express";
import { conifg } from "./config/env.config";

const app = express();
const port = conifg.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on port ${port} in ${conifg.NODE_ENV}`);
});
