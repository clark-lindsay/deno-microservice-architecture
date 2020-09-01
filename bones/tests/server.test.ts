import { superoak } from "https://deno.land/x/superoak@2.1.0/mod.ts";

import { initializeServer } from "../src/initialize_server.ts";
import { createConfig } from "../src/config.ts";

const app = initializeServer(createConfig());

Deno.test({
  name: "when GET-ing the root, it returns a 200",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/").expect(200);
  },
});

