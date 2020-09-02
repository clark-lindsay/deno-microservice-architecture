import { createDBClient } from "./createDBClient.ts";
import { createHome, App } from "./app/home/index.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";
import { getDBCredentials } from "./utilities.ts";

export function createConfig(): AppConfig {
  const db = createDBClient(getDBCredentials());
  const home = createHome({ db });

  return {
    db,
    home,
  };
}

export interface AppConfig {
  db: Promise<Client>;
  home: App;
}
