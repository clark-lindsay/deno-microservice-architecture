import { Client } from "https://deno.land/x/postgres/mod.ts";

export async function createDBClient({
  connectcionString,
}: DBConnectionArgs): Promise<Client> {
  const client = new Client({
    user: "postgres",
    database: "practical_microservices",
    hostname: "localhost",
    port: 5432,
  });
  await client.connect();

  return client;
}

interface DBConnectionArgs {
  connectcionString: string;
  migrationsTableName?: string;
}
