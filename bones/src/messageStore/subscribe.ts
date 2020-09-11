import { uuid, QueryResult } from "../../deps.ts";
import { MessageWriteArgs, OutgoingMessage } from "./write.ts";
import { IncomingMessage } from "./index.ts";

export function configureCreateSubscription({
  read,
  readLastMessage,
  write,
}: SubscriptionCreationArgs) {
  return ({
    streamName,
    handlers,
    messagesPerTick = 100,
    subscriberId,
    positionUpdateInterval = 100,
    tickIntervalInMs = 100,
  }: ConfigureCreateArgs) => {
    const subscriberStreamName = `subscriberPosition-${subscriberId}`;
    let [currentPosition, messagesSinceLastWrite] = [0, 0];
    let keepGoing = true;

    async function loadPosition() {
      const message = await readLastMessage(subscriberStreamName);
      currentPosition = message ? message.position : 0;
    }

    async function updateReadPosition(position: number): Promise<any> {
      currentPosition = position;
      messagesSinceLastWrite += 1;

      if (messagesSinceLastWrite === positionUpdateInterval) {
        messagesSinceLastWrite = 0;
        return writePosition(position);
      }
      return Promise.resolve(true);
    }

    async function writePosition(position: number) {
      const positionEvent: OutgoingMessage = {
        id: uuid.v4.generate(),
        type: "Read",
        data: { position },
        metaData: {},
      };
      return write({
        streamName: subscriberStreamName,
        message: positionEvent,
        expectedVersion: 0,
      });
    }

    function getNextBatchOfMessages() {
      return read({
        streamName,
        fromPosition: currentPosition + 1,
        maxMessages: messagesPerTick,
      });
    }

    async function processBatch(messages: IncomingMessage[]): Promise<number> {
      messages.forEach((message) => {
        handleMessage(message)
          .then(() => updateReadPosition(message.globalPosition))
          .catch((err) => {
            console.error(err);
            throw err;
          });
      });
      return messages.length;
    }

    async function handleMessage(message: IncomingMessage): Promise<any> {
      const handler = handlers[message.type] || handlers.$any;
      return handler ? handler(message) : Promise.resolve(true);
    }

    function start() {
      console.log(`Started subscription for ${subscriberId}`);
      return poll();
    }

    function stop() {
      console.log(`Stopped subscription for ${subscriberId}`);
      keepGoing = false;
    }

    async function poll() {
      await loadPosition();
      while (keepGoing) {
        const messagesProcessed = await tick();
        if (messagesProcessed === 0) {
          await delay(tickIntervalInMs);
        }
      }
    }

    async function tick() {
      return getNextBatchOfMessages()
        .then(processBatch)
        .catch((err) => {
          console.error("Error processing batch", err);
          stop();
        });
    }

    return {
      loadPosition,
      start,
      stop,
      tick,
      writePosition,
    };
  };
}

export interface SubscriptionCreationArgs {
  read: ({
    streamName,
    fromPosition,
    maxMessages,
  }: {
    streamName: string;
    fromPosition: number;
    maxMessages: number;
  }) => Promise<IncomingMessage[]>;
  readLastMessage: (subscriberStreamName: string) => Promise<IncomingMessage>;
  write: (args: MessageWriteArgs) => Promise<QueryResult>;
}

interface ConfigureCreateArgs {
  streamName: string;
  handlers: { [key: string]: (event: IncomingMessage) => any };
  messagesPerTick?: number;
  subscriberId: string;
  positionUpdateInterval?: number;
  tickIntervalInMs?: number;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
