import { createWrite, Message } from "./write.ts";
import { MessageStorePGClient } from "../createMessageStorePGClient.ts";
import { QueryResult } from "../../deps.ts";

export function createMessageStore({
  db,
}: {
  db: MessageStorePGClient;
}): MessageStore {
  const write = createWrite(db);

  return {
    write,
  };
}

export interface MessageStore {
  write: (
    streamName: string,
    message: Message,
    expectedVersion: number
  ) => Promise<QueryResult>;
}
