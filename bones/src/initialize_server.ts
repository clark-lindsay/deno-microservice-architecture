import { oak } from "./deps.ts";
import { mountMiddleware } from "./mountMiddleware.ts";
import { mountRoutes } from "./oak/mountRoutes.ts";

export function initializeServer(config: any): oak.Application {
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
    mountRoutes(ctx.app, config);
  });
  mountMiddleware(app);

  return app;
}

