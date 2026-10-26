import cors from "cors";
import helmet from "helmet";
import express from "express";
import { env } from "./config/env.js";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

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

// api docs
app.get("/api/docs.json", (req, res) => res.json(openapiSpec));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)

// must be registered after all routes
app.use(notFound)
app.use(errorHandler)

export default app;
