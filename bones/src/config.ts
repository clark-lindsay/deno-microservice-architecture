import { createDBClient } from "./createDexClient.ts";
import { createHome } from "./app/home/index.ts";

export function createConfig(): any {
  const dbConnectionURL = Deno.env.get("DATABASE_URL");
  if (!dbConnectionURL) {
    throw new Error("No environment variable found for 'DATABASE_URL'");
  }

  const db = createDBClient({
    connectcionString: dbConnectionURL ?? "",
  });
  const homeApp = createHome({ db });

  return {
    db,
    homeApp,
  };
}
