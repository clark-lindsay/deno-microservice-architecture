import { superoak } from "../src/deps.ts";

import { createServer } from "../src/createServer.ts";
import { createConfig } from "../src/config.ts";

const config = createConfig();
const app = createServer(config);

Deno.test({
  name: "when GET-ing the root, it returns a 200 OK status",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/").expect(200);
    const db = await config.db;
    db.end();
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
