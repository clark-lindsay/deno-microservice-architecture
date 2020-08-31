import { initializeServer } from "./initialize_server.ts";
import { createConfig } from "./config.ts";

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

function getAppName(): string | undefined {
  const result = Deno.env.get("APP_NAME");
  if (result) {
    return result;
  }
  return undefined;
}

function getPort(): number | undefined {
  const result = Deno.env.get("PORT");
  if (result !== undefined) {
    return parseInt(result);
  }
  return undefined;
}
