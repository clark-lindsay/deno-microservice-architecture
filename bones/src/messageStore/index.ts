import { createWrite, Message, MessageWriteArgs } from "./write.ts";
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
  write: (args: MessageWriteArgs) => Promise<QueryResult>;
}
