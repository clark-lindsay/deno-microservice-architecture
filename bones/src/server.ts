import { createServer } from "./createServer.ts";
import { createConfig } from "./config.ts";
import { getAppName, getPort } from "./utilities.ts";

const config = await createConfig();
const app = createServer(config);

app.addEventListener("listen", ({ hostname, port }) => {
  const appName = getAppName();

  console.log(
    appName ? `Started ${appName}` : "No APP_NAME environment variable found."
  );
  console.log(`Listening on http://${hostname ?? "localhost"}:${port}`);
});

await app.listen({ port: getPort() ?? 8080 });

config.db.then((client) => {
  console.log("Closing the database connection");
  client.end();
});
