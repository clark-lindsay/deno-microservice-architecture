import { oak } from "../../deps.ts";
import { AppConfig } from "../config.ts";
import { createHome, App } from "../app/home/index.ts";
import { createRecordViewings } from "../app/record-viewings/index.ts";

export function mountRoutes(serverApp: oak.Application, config: AppConfig) {
  const router = new oak.Router();

  router.get("/", (ctx) => {
    ctx.response.body = `<h1>${ctx.state.requestTraceId}</h1>`;
  });

  const apps: App[] = [];
  apps.push(createHome({ db: config.db }));
  apps.push(createRecordViewings({ messageStore: config.messageStore }));

  serverApp.use(router.routes());
  serverApp.use(router.allowedMethods());
  apps.forEach((app) => {
    serverApp.use(app.router.routes());
    serverApp.use(app.router.allowedMethods());
  });
}
