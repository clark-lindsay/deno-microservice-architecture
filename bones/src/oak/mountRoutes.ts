import { oak } from "../deps.ts";
import { AppConfig } from "../config.ts";
import { createHome } from "../app/home/index.ts";
import { createDBClient } from "../createDBClient.ts";

export function mountRoutes(app: oak.Application, config: AppConfig) {
  const router = new oak.Router();

  router.get("/", (ctx) => {
    ctx.response.body = `<h1>${ctx.state.requestTraceId}</h1>`;
  });

  const home = createHome({ db: config.db });

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.use(home.router.routes());
  app.use(home.router.allowedMethods());
}
