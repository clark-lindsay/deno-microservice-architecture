import { camelCase } from "./deps.ts";
import { oak } from "./deps.ts";
import { renderFile } from "https://deno.land/x/dejs/mod.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";

function createHandlers({ queries }: { queries: Queries }): any {
  function home(ctx: oak.Context): Promise<any> {
    return queries["loadHomePage"]()
      .then((viewData: any) => (ctx.response.body = viewData))
      .catch(ctx.throw(500));
  }
  return { home };
}

function createQueries({ db }: { db: Promise<any> }): any {
  function loadHomePage() {
    return db.then((client) =>
      client("videos")
        .sum("view_count as videosWatched")
        .then((rows: any) => rows[0])
    );
  }

  return { loadHomePage };
}

interface Queries {
  [key: string]: () => Promise<any>;
}
