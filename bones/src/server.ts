import { initializeServer, getPort } from "./hello-world-server.ts";

const app = initializeServer();
app.listen({ port: getPort() ?? 8080 });
