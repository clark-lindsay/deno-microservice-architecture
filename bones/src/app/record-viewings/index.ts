import { uuid, oak } from "../../../deps.ts";
import { OutgoingMessage } from "../../messageStore/write.ts";
import { MessageStore } from "../../messageStore/index.ts";
import { App, Actions } from "../home/index.ts";

export function createRecordViewings({
  messageStore,
}: {
  messageStore: MessageStore;
}): App {
  const actions = createActions({ messageStore });
  const handlers = createHandlers({ actions });
  const router = new oak.Router();
  router.all("/:videoId", (ctx) => {
    const requestParams = oak.helpers.getQuery(ctx);
    handlers.recordViewing(ctx, requestParams);
  });

  return {
    actions,
    handlers,
    router,
  };
}

function createHandlers({ actions }: { actions: Actions }) {
  async function recordViewing(ctx: oak.Context, requestParams: any) {
    const { videoId, userId } = requestParams;
    if (!videoId || userId) {
      throw new Error("No videoId found in command to record viewing");
    }
    return actions
      .recordViewing({
        traceId: ctx.state.requestTraceId,
        videoId: videoId,
        userId: userId,
      })
      .then(() => ctx.response.redirect("/"));
  }
  return {
    recordViewing,
  };
}

export function createActions({
  messageStore,
}: {
  messageStore: MessageStore;
}): Actions {
  async function recordViewing(args: RecordViewingArgs) {
    const { traceId, userId, videoId } = args;
    const viewedEvent: OutgoingMessage = {
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

interface RecordViewingArgs {
  traceId: string;
  userId: string;
  videoId: string;
}
