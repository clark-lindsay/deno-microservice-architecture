import { Client } from "https://deno.land/x/postgres/mod.ts";
import { DBCredentials } from "./utilities.ts";

export async function createDBClient(dbInfo: DBCredentials): Promise<Client> {
  const client = new Client({
    user: dbInfo.user,
    database: dbInfo.databaseName,
    hostname: dbInfo.hostname,
    port: dbInfo.port,
  });
  await client.connect();

  return client;
}

