import { createDBClient } from "./createDBClient.ts";
import { createHome, App } from "./app/home/index.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

export function createConfig(): AppConfig {
  const db = initializeDB();
  const home = createHome({ db });

  return {
    db,
    home,
  };
}

export async function initializeDB(): Promise<Client> {
  const dbConnectionURL = Deno.env.get("DATABASE_URL");
  if (!dbConnectionURL) {
    throw new Error("No environment variable found for 'DATABASE_URL'");
  }

  return await createDBClient({
    connectcionString: dbConnectionURL ?? "",
  });
}

export interface AppConfig {
  db: Promise<Client>;
  home: App;
}
