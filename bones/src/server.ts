import { initializeServer } from "./initialize_server.ts";
import { createConfig } from "./config.ts";
import { getAppName, getPort } from "./utilities.ts";

const config = createConfig();
const app = initializeServer(config);

app.addEventListener("listen", ({ hostname, port }) => {
  const appName = getAppName();

  console.log(
    appName ? `Started ${appName}` : "No APP_NAME environment variable found."
  );
  console.log(`Listening on http://${hostname ?? "localhost"}:${port}`);
});
app.listen({ port: getPort() ?? 8080 });
