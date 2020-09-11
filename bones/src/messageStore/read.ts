import { MessageStorePGClient } from "../createMessageStorePGClient.ts";
import { IncomingMessage } from "./index.ts";
import { deserializeMessage } from "./deserializeMessage.ts";

export function createRead({ db }: { db: MessageStorePGClient }) {
  async function read({
    streamName,
    fromPosition,
    maxMessages,
  }: {
    streamName: string;
    fromPosition: number;
    maxMessages: number;
  }): Promise<IncomingMessage[]> {
    const getCategoryMessages = `SELECT * FROM get_category_messages('${streamName}', ${fromPosition}, ${maxMessages})`;
    const getStreamMessages = `SELECT * FROM get_stream_messages('${streamName}', ${fromPosition}, ${maxMessages})`;
    const getMessagesSQL = isIdentityStream(streamName)
      ? getStreamMessages
      : getCategoryMessages;

    const queryResult = await db.query(getMessagesSQL);
    await db.stop();
    return queryResult.rows.map((rawMessage) => deserializeMessage(rawMessage));

    function isIdentityStream(streamName: string): boolean {
      return streamName.includes("-");
    }
  }

  async function readLastMessage(streamName: string) {
    const getLastMessage = `SELECT * FROM get_last_stream_message('${streamName}')`;

    const result = await db.query(getLastMessage);
    await db.stop();
    return result.rows[0];
  }

  return {
    read,
    readLastMessage,
  };
}
