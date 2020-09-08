import { postgres } from "../deps.ts";
import { DBCredentials } from "./utilities.ts";
import { QueryResult } from "../deps.ts";

export async function createDBClient(
  dbInfo: DBCredentials
): Promise<MessageStore> {
  const result = new postgres.Client({
    user: dbInfo.user,
    database: dbInfo.databaseName,
    hostname: dbInfo.hostname,
    port: dbInfo.port,
  });
  await result.connect();
  await result.query("SET search_path = message_store, public");

  async function query(sql: string): Promise<QueryResult> {
    await result.connect();
    return result.query(sql);
  }

  return {
    db: result,
    query,
    stop: () => result.end(),
  };
}

export interface MessageStore {
  db: postgres.Client;
  query: (sql: string) => Promise<QueryResult>;
  stop: () => Promise<void>;
}
