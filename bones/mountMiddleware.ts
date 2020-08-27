import { uuid } from "./deps.ts";
import { Application, Context } from "https://deno.land/x/oak/mod.ts";

export function mountMiddleware(app: Application) {
  app.use(applyLocalContextToState);
  app.use(setTraceIdHeader);
}

function setTraceIdHeader(ctx: Context) {
  ctx.request.headers.set("TraceId", uuid.v4.generate());
}

async function applyLocalContextToState(
  ctx: Context,
  next: () => Promise<void>
) {
  await next();
  ctx.state["traceId"] = ctx.request.headers.get("TraceId") ?? null;
}
