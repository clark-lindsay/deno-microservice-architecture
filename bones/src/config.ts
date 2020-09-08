import { postgres } from "../deps.ts";

import { createDBClient } from "./createDBClient.ts";
import { createHome, App } from "./app/home/index.ts";
import { getDBCredentials } from "./utilities.ts";
import { createMessageStorePGClient } from "./createMessageStorePGClient.ts";
import { createMessageStore, MessageStore } from "./messageStore/index.ts";

export async function createConfig(): Promise<AppConfig> {
  const db = createDBClient(getDBCredentials());
  const messageStoreClient = await createMessageStorePGClient(
    getDBCredentials()
  );
  const messageStore = createMessageStore({ db: messageStoreClient });

  const home = createHome({
    db,
  });

  return {
    db,
    messageStore,
    home,
    _rawMsgStoreDB: messageStoreClient._rawDB,
  };
}

export interface AppConfig {
  db: Promise<postgres.Client>;
  messageStore: MessageStore;
  home: App;
  _rawMsgStoreDB: postgres.Client;
}
