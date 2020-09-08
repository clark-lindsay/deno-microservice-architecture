import { superoak, asserts } from "../deps.ts";

import { createServer } from "../src/createServer.ts";
import { createConfig } from "../src/config.ts";

const config = createConfig();
const app = createServer(config);

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
    const db = await config.db;
    await db.query("SET search_path = message_store, public");
    const result = await db.query(describeTable);
    await db.end();

    asserts.assert(result.rowCount === 8);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
