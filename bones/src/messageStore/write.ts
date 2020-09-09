import { QueryResult } from "../../deps.ts";
import { MessageStorePGClient } from "../createMessageStorePGClient.ts";

export function createWrite(
  db: MessageStorePGClient
): (args: MessageWriteArgs) => Promise<QueryResult> {
  return async ({ streamName, message, expectedVersion }: MessageWriteArgs) => {
    if (!message.type) {
      throw new Error("Messages must have a type");
    }

    return db.query(createQueryString()).catch((err: Error) => {
      const versionConflictErrorRegex: RegExp = /Wrong.*Stream Version: (.\d+)\)/;
      const errorMatch = err.message.match(versionConflictErrorRegex);
      if (errorMatch === null) {
        throw err;
      }
      const actualVersion = parseInt(errorMatch[1], 10);

      throw new Error(
        `VersionConflict: stream ${streamName};
				expectedVersion: ${expectedVersion},
				actualVersion: ${actualVersion}`
      );
    });

    function createQueryString(): string {
      const values = [
        message.id,
        streamName,
        message.type,
        JSON.stringify(message.data),
        JSON.stringify(message.metaData),
        expectedVersion,
      ];
      return `SELECT write_message('${values[0]}',
																	 '${values[1]}',
																	 '${values[2]}',
																	 '${values[3]}',
																	 '${values[4]}',
																	 ${values[5]});`;
    }
  };
}

export interface Message {
  type: string;
  data: object;
  metaData: object;
  id: string;
}

export interface MessageWriteArgs {
  streamName: string;
  message: Message;
  expectedVersion: number;
}
