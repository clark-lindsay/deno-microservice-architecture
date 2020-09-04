import { oak } from "../deps.ts";
import { mountMiddleware } from "./mountMiddleware.ts";
import { mountRoutes } from "./oak/mountRoutes.ts";
import { AppConfig } from "./config.ts";

export function createServer(config: AppConfig): oak.Application {
  const app = new oak.Application();
  mountMiddleware(app);
  mountRoutes(app, config);

  return app;
}
