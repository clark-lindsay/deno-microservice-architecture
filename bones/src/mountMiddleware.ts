import { uuid } from "./deps.ts";
import { Application, Context } from "https://deno.land/x/oak/mod.ts";

export function mountMiddleware(app: Application) {
  app.use(generateRequestTraceId);
}

async function generateRequestTraceId(ctx: Context, next: () => Promise<any>) {
  ctx.state["requestTraceId"] = uuid.v4.generate();
  await next();
}
