import express from "express";
import cors from "cors";

import apiRoutes from "./routes/index.js";

import {
  notFoundMiddleware,
} from "./middleware/not-found.middleware.js";

import {
  errorMiddleware,
} from "./middleware/error.middleware.js";

import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api", apiRoutes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;