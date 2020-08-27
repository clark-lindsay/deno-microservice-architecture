import { initializeServer, getPort } from "./initialize_server.ts";

const app = initializeServer();
app.listen({ port: getPort() ?? 8080 });
