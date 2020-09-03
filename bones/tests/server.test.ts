import { superoak } from "../src/deps.ts";

import { createServer } from "../src/createServer.ts";
import { createConfig } from "../src/config.ts";

const config = createConfig();
const app = createServer(config);
await startTestDB();

Deno.test({
  name: "when GET-ing the root, it returns a 200 OK status",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name:
    "when GET-ing the '/query' route, it returns a sum of the views in the test table",
  fn: async () => {
    const request = await superoak(app);
    await request.get("/query").expect(200).expect("<p>42</p>");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

async function startTestDB() {
  await runNessieCommand("rollback");
  await runNessieCommand("migrate");
  await runNessieCommand("seed");

  async function runNessieCommand(command: string) {
    const rollbackDB = Deno.run({
      cmd: createNessieCommand(command),
    });

    const { code } = await rollbackDB.status();
    if (code !== 0) {
      throw Error(`${command} failed!`);
    }
  }

  function createNessieCommand(command: string): string[] {
    return `deno run --allow-net --allow-read
		https://deno.land/x/nessie/cli.ts ${command}`
      .split(/(\s+)/)
      .filter((e) => e.trim().length > 0);
  }
}
