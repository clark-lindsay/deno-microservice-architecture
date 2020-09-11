import { IncomingMessage } from "./index.ts";

export function deserializeMessage(rawMessage: any): IncomingMessage {
  if (!rawMessage || Object.entries(rawMessage).length === 0) {
    throw new Error(
      `Received a bad message from the database:\n ${rawMessage}`
    );
  }

  const result: IncomingMessage = {
    id: rawMessage.id,
    streamName: rawMessage.stream_name,
    type: rawMessage.type,
    position: parseInt(rawMessage.position, 10),
    globalPosition: parseInt(rawMessage.global_position, 10),
    data: rawMessage.data ? JSON.parse(rawMessage.data) : {},
    metaData: rawMessage.metadata ? JSON.parse(rawMessage.metadata) : {},
    time: rawMessage.time,
  };
  return result;
}
