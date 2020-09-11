import { asserts, uuid } from "../deps.ts";

import { createConfig } from "../src/config.ts";
import { OutgoingMessage } from "../src/messageStore/write.ts";

const config = await createConfig();

Deno.test({
  name: "the message store exists when the app is launched",
  fn: async () => {
    const describeTable = `SELECT 
															 table_name, 
															 column_name, 
															 data_type 
														FROM 
															 information_schema.columns
														WHERE 
															 table_name = 'messages';`;
    const db = config._rawMsgStoreDB;
    await db.query("SET search_path = message_store, public");
    const result = await db.query(describeTable);
    await db.end();

    asserts.assert(result.rowCount === 8);
  },
  sanitizeResources: false,
});

Deno.test({
  name: "the 'write' method allows appending to the message store",
  fn: async () => {
    const messageDB = await config._rawMsgStoreDB;
    const testMessage = createTestMessage({ type: "TestWrite" });

    await config.messageStore.write({
      streamName: `test-${testMessage.id}`,
      message: testMessage,
      expectedVersion: -1,
    });

    const messages = await messageDB.query(
      `SELECT * FROM message_store.messages WHERE id = '${testMessage.id}'`
    );

    asserts.assertEquals(messages.rowCount, 1);
  },
  sanitizeResources: false,
});

Deno.test({
  name:
    "the 'write' method should throw a version conflict error if the expected version of the stream is incorrect",
  fn: async () => {
    const testMessage = createTestMessage({ type: "TestWrite" });

    asserts.assertThrowsAsync(
      () =>
        config.messageStore.write({
          streamName: `test-${testMessage.id}`,
          message: testMessage,
          expectedVersion: 10,
        }),
      Error,
      "VersionConflict"
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

function createTestMessage({ type }: { type: string }): OutgoingMessage {
  return {
    id: uuid.v4.generate(),
    type,
    data: {
      ownerId: uuid.v4.generate(),
      sourceUri: "https://sourceurl.com/",
    },
    metaData: {
      traceId: uuid.v4.generate(),
    },
  };
}
