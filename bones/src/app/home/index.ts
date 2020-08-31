import { oak } from "../../deps.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { QueryResult } from "https://deno.land/x/postgres/query.ts";

export function createHome({ db }: { db: Promise<Client> }) {
  const queries = createQueries({ db });
  const handlers = createHandlers({ queries });
  const router = new oak.Router();

  router.get("/", handlers.home);

  return { handlers, queries, router };
}

function createQueries({ db }: { db: Promise<Client> }): any {
  async function loadHomePage() {
    return db.then(async (client) => {
      const dex = Dex({ client: "postgres" });
      const queryString = dex("videos")
        .sum("view_count as videosWatched")
        .toString();

      const result: QueryResult = await client.query(queryString);
      console.log(result.rows[0]);
      return result.rows[0];
    });
  }

  return { loadHomePage };
}

function createHandlers({ queries }: { queries: Queries }): Handlers {
  function home(ctx: oak.Context): Promise<any> {
    return queries["loadHomePage"]()
      .then((viewData: any) => (ctx.response.body = `<p> ${viewData} </p>`))
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
