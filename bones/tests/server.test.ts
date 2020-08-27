import { superoak } from "https://deno.land/x/superoak@2.1.0/mod.ts";

import { initializeServer } from "../hello-world-server.ts";

const app = initializeServer();

Deno.test({
  name: "when GET-ing the root, it returns a 200",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/").expect(200);
  },
});
