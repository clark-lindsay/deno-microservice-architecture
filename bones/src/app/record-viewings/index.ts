import { uuid } from "../../../deps.ts";
import { Message } from "../../messageStore/write.ts";
import { MessageStore } from "../../messageStore/index.ts";

export function createActions({
  messageStore,
}: {
  messageStore: MessageStore;
}) {
  function recordViewing(traceId: string, videoId: string, userId: string) {
    const viewedEvent: Message = {
      id: uuid.v4.generate(),
      type: "VideoViewed",
      metaData: {
        traceId,
        userId,
      },
      data: {
        userId,
        videoId,
      },
    };
    const streamName = `viewing-${videoId}`;

    return messageStore.write({
      streamName,
      message: viewedEvent,
      expectedVersion: 0,
    });
  }

  return {
    recordViewing,
  };
}
