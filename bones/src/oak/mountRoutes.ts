import { oak } from "../deps.ts";

export function mountRoutes(app: oak.Application, config: any) {
  app.use(config.homeApp.router.routes);
}
