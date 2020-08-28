import { createDexClient } from "./createDexClient.ts";

export function createConfig(): void {
  const dbConnectionURL = Deno.env.get("DATABASE_URL");
  if (!dbConnectionURL) {
    throw new Error("No environment variable found for 'DATABASE_URL'");
  }

  const db = createDexClient({
    connectcionString: dbConnectionURL ?? "",
  });
}
