import { oak } from "../deps.ts";
import { AppConfig } from "../config.ts";

export function mountRoutes(app: oak.Application, config: AppConfig) {
  const router = new oak.Router();
  router.get("/", (ctx) => {
    ctx.response.body = `<h1>${ctx.state.requestTraceId}</h1>`;
  });
  app.use(router.routes());
  app.use(router.allowedMethods());
}
