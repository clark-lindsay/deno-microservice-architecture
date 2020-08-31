import { camelCase } from "../../deps.ts";
import { oak } from "../../deps.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";

export function createHome({ db }: { db: Promise<any> }) {
  const queries = createQueries({ db });
  const handlers = createHandlers({ queries });
  const router = new oak.Router();

  router.get("/", handlers.home);

  return { handlers, queries, router };
}

function createQueries({ db }: { db: Promise<any> }): any {
  async function loadHomePage() {
    return db.then((client) =>
      client("videos")
        .sum("view_count as videosWatched")
        .then((rows: any) => rows[0])
    );
  }

  return { loadHomePage };
}

function createHandlers({ queries }: { queries: Queries }): Handlers {
  function home(ctx: oak.Context): Promise<any> {
    return queries["loadHomePage"]()
      .then((viewData: any) => (ctx.response.body = viewData))
      .catch(ctx.throw(500));
  }
  return { home };
}

interface Queries {
  [key: string]: () => Promise<any>;
}

interface Handlers {
  [key: string]: (ctx: oak.Context) => Promise<any>;
}
