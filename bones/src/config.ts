import { createDBClient } from "./createDexClient.ts";
import { createHome } from "./app/home/index.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

export function createConfig(): any {
  const db = initializeDB();
  const homeApp = createHome({ db });

  return {
    db,
    homeApp,
  };
}

export async function initializeDB(): Promise<Client> {
  const dbConnectionURL = Deno.env.get("DATABASE_URL");
  if (!dbConnectionURL) {
    throw new Error("No environment variable found for 'DATABASE_URL'");
  }

  return createDBClient({
    connectcionString: dbConnectionURL ?? "",
  });
}
