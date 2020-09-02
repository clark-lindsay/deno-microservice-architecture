import { postgres } from "./deps.ts";
import { DBCredentials } from "./utilities.ts";

export async function createDBClient(
  dbInfo: DBCredentials
): Promise<postgres.Client> {
  const result = new postgres.Client({
    user: dbInfo.user,
    database: dbInfo.databaseName,
    hostname: dbInfo.hostname,
    port: dbInfo.port,
  });
  await result.connect();

  return result;
}
