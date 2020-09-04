import { uuid } from "../deps.ts";
import { oak } from "../deps.ts";

export function mountMiddleware(app: oak.Application) {
  app.use(generateRequestTraceId);
}

async function generateRequestTraceId(
  ctx: oak.Context,
  next: () => Promise<any>
) {
  ctx.state["requestTraceId"] = uuid.v4.generate();
  await next();
}
