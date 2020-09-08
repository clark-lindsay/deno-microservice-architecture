import { QueryResult } from "../../deps.ts";
import { MessageStorePGClient } from "../createMessageStorePGClient.ts";

const versionConflictErrorRegex: RegExp = /^Wrong.*Stream Version: (\d+)\)/;

export function createWrite(
  db: MessageStorePGClient
): (
  streamName: string,
  message: Message,
  expectedVersion: number
) => Promise<QueryResult> {
  return async (
    streamName: string,
    message: Message,
    expectedVersion: number
  ) => {
    if (!message.type) {
      throw new Error("Messages must have a type");
    }

    const queryString = `SELECT message_store.write_message(${message.id}, ${streamName}, ${message.type}, ${message.data}, ${message.metaData}, ${expectedVersion})`;

    return db.query(queryString).catch((err: any) => {
      const errorMatch = err.message.match(versionConflictErrorRegex);
      if (errorMatch === null) {
        throw err;
      }
      const actualVersion = parseInt(errorMatch[1], 10);

      throw new Error(
        `VersionConflict: stream ${streamName}; expectedVersion: ${expectedVersion}, actualVersion: ${actualVersion}`
      );
    });
  };
}

export interface Message {
  type: string;
  data: object;
  metaData: object;
  id: string;
}
