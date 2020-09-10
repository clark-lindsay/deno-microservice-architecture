import { oak } from "../../../deps.ts";
import { camelCase } from "../../../deps.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";
import { postgres, QueryResult } from "../../../deps.ts";

export function createHome({ db }: { db: Promise<postgres.Client> }): App {
  const queries = createQueries({ db });
  const handlers = createHandlers({ queries });
  const router = new oak.Router();

  router.get("/query", handlers.home);

  return { handlers, queries, router };
}

function createQueries({ db }: { db: Promise<postgres.Client> }): Queries {
  async function loadHomePage() {
    return db.then(async (client: postgres.Client) => {
      const dex = Dex({ client: "postgres" });
      const queryString = dex("pages").where({ page_name: "home" }).limit(1);

      const queryResult: QueryResult = await client.query(queryString);
      return queryResult.rows[0];
    });
  }

  return { loadHomePage };
}

function createHandlers({ queries }: { queries: Queries }): Handlers {
  async function home(ctx: oak.Context): Promise<void> {
    const viewData = await queries.loadHomePage();
    ctx.response.body = `<p>${viewData}</p>`;
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
