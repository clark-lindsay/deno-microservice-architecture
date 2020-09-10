import { createWrite, MessageWriteArgs } from "./write.ts";
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
  createSubscription: ({
    streamName,
    handlers,
    subscriberId,
  }: {
    streamName: string;
    handlers: any;
    subscriberId: string;
  }) => any;
}

export interface IncomingMessage {
  streamName: string;
  position: number;
  globalPosition: number;
  time: Date;
  type: string;
  data: { position: number };
  metaData: object;
  id: string;
}
