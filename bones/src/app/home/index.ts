import { oak } from "../../deps.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres/query.ts";

export function createHome({ db }: { db: Promise<Client> }): App {
  const queries = createQueries({ db });
  const handlers = createHandlers({ queries });
  const router = new oak.Router();

  router.get("/", handlers.home);

  return { handlers, queries, router };
}

function createQueries({ db }: { db: Promise<Client> }): Queries {
  async function loadHomePage() {
    return db.then(async (client: Client) => {
      const dex = Dex({ client: "postgres" });
      const queryString = dex("videos")
        .sum("view_count as videosWatched")
        .toString();

      const result: QueryResult = await client.query(queryString);
      return result.rows[0];
    });
  }

  return { loadHomePage };
}

function createHandlers({ queries }: { queries: Queries }): Handlers {
  async function home(ctx: oak.Context): Promise<void> {
    queries
      .loadHomePage()
      .then((viewData: any) => (ctx.response.body = `<p> ${viewData} </p>`));
  }
  return { home };
}

export interface App {
  handlers: Handlers;
  queries: Queries;
  router: oak.Router;
}

interface Queries {
  [key: string]: () => Promise<any>;
}

interface Handlers {
  [key: string]: (ctx: oak.Context) => void;
}
