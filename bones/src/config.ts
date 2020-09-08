import { createDBClient } from "./createDBClient.ts";
import { createHome, App } from "./app/home/index.ts";
import { postgres } from "../deps.ts";
import { getDBCredentials } from "./utilities.ts";

export function createConfig(): AppConfig {
  const messageStoreInterface = createDBClient(getDBCredentials());
  const home = createHome({
    db: messageStoreInterface.then((store) => store.db),
  });

  return {
    db: messageStoreInterface.then((store) => store.db),
    home,
  };
}

export interface AppConfig {
  db: Promise<postgres.Client>;
  home: App;
}
