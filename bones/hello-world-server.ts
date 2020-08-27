import { oak } from "./deps.ts";
import { mountMiddleware } from "./mountMiddleware.ts";

export function initializeServer(): oak.Application {
  const app = new oak.Application();

  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (oak.isHttpError(err)) {
        switch (err.status) {
          case oak.Status.NotFound:
            // handle NotFound
            break;
          default:
            ctx.throw(500);
        }
      } else {
        // rethrow if you can't handle the error
        throw err;
      }
    }
  });

  app.use(async (ctx, next) => {
    await next();
    ctx.response.body = `Hello, id: ${ctx.request.headers.get("TraceId")} !\n`;
  });
  mountMiddleware(app);

  app.addEventListener("listen", ({ hostname, port }) => {
    console.log(`Listening on http://${hostname ?? "localhost"}:${port}`);
  });

  return app;
}

export function getPort(): number | undefined {
  const result = Deno.env.get("PORT");
  if (result) {
    return parseInt(result);
  }
  return undefined;
}
