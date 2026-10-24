import cors from "cors";
import helmet from "helmet";
import express from "express";
import { env } from "./config/env.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// global middlewares
app.use(helmet()); // secure http headers
app.use(cors()); // allow browsers on other origins to call api
app.use(express.json({ limit: "100kb" }));
if (env.NODE_ENV !== "staging") {
  app.use(morgan("dev")); // log each request
}

app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRoutes)

export default app;
