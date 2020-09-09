import { postgres } from "../deps.ts";
import { DBCredentials } from "./utilities.ts";
import { QueryResult } from "../deps.ts";

export async function createMessageStorePGClient(
  dbInfo: DBCredentials
): Promise<MessageStorePGClient> {
  const result = new postgres.Client({
    user: dbInfo.user,
    database: dbInfo.messageStoreName,
    hostname: dbInfo.hostname,
    port: dbInfo.messageStorePort,
  });
  await result.connect();

  async function query(sql: string): Promise<QueryResult> {
    await result.connect();
    await result.query("SET search_path = message_store, public");
    return result.query(sql);
  }

  return {
    query,
    stop: () => result.end(),
    _rawDB: result,
  };
}

export interface MessageStorePGClient {
  query: (sql: string) => Promise<QueryResult>;
  stop: () => Promise<void>;
  _rawDB: postgres.Client;
}
