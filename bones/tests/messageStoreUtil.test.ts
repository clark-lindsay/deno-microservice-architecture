import { uuid, asserts } from "../deps.ts";
import { IncomingMessage } from "../src/messageStore/index.ts";
import { deserializeMessage } from "../src/messageStore/deserializeMessage.ts";

Deno.test({
  name:
    "'deserializeMessage' transforms a raw SQL response into an IncomingMessage",
  fn: () => {
    const rawMessage = {
      id: uuid.v4.generate(),
      stream_name: "Test",
      type: "Test",
      position: "10",
      global_position: "20",
      data: JSON.stringify({
        ownerId: "id",
        resourceId: "id",
      }),
      metadata: JSON.stringify({
        metaInfo: "info",
      }),
      time: new Date(2020, 4, 23),
    };

    const expected: IncomingMessage = {
      id: rawMessage.id,
      streamName: "Test",
      type: "Test",
      position: 10,
      globalPosition: 20,
      data: {
        ownerId: "id",
        resourceId: "id",
      },
      metaData: {
        metaInfo: "info",
      },
      time: new Date(2020, 4, 23),
    };

    asserts.assertEquals(deserializeMessage(rawMessage), expected);
  },
});

Deno.test({
  name: "'deserializeMessage' throws if the input is null, undefined, or empty",
  fn: () => {
    asserts.assertThrows(() => deserializeMessage({}));
    asserts.assertThrows(() => deserializeMessage(null));
    asserts.assertThrows(() => deserializeMessage(undefined));
  },
});
