import { createWrite, MessageWriteArgs } from "./write.ts";
import { MessageStorePGClient } from "../createMessageStorePGClient.ts";
import { QueryResult } from "../../deps.ts";
import { configureCreateSubscription } from "./subscribe.ts";
import { createRead } from "./read.ts";

export function createMessageStore({
  db,
}: {
  db: MessageStorePGClient;
}): MessageStore {
  const write = createWrite(db);
  const readOptions = createRead({ db });
  const createSubscription = configureCreateSubscription({
    read: readOptions.read,
    readLastMessage: readOptions.readLastMessage,
    write,
  });

  return {
    createSubscription,
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
    messagesPerTick?: number;
    tickIntervalInMs?: number;
    positionUpdateInterval?: number;
  }) => any;
}

export interface IncomingMessage {
  streamName: string;
  position: number;
  globalPosition: number;
  time: Date;
  type: string;
  data: object;
  metaData: object;
  id: string;
}
