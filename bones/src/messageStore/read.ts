import { postgres } from "../../deps.ts";

export function createRead({ db }: { db: Promise<postgres.Client> }) {
  async function readLastMessage(streamName: string) {
    const getLastMessage = `SELECT * FROM get_last_stream_message(${streamName})`;
    const client = await db;

    const result = await client.query(getLastMessage);
    return result.rows[0];
  }

  return {
    readLastMessage,
  };
}
