import { superoak } from "../deps.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";

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
    "when GET-ing the '/query' route, it returns a sum of the views in the test videos table",
  fn: async () => {
    let request = await superoak(app);
    await request.get("/query").expect(200).expect("<p></p>");

    const setupQuery = Dex({ client: "postgres" })("videos")
      .insert({
        owner_id: "Girlfriend Reviews",
        name: "Should your boyfriend write an app in Deno?",
        description: "Hard to say...",
        transcoding_status: "working on it",
        view_count: 42,
      })
      .toString();
    const db = await config.db;
    await db.query(setupQuery);

    request = await superoak(app);
    await request.get("/query").expect(200).expect("<p>42</p>");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

async function startTestDB() {
  await runNessieCommand("rollback");
  await runNessieCommand("migrate");

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
