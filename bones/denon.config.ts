import { DenonConfig } from "https://deno.land/x/denon@2.3.2/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run server.ts",
      desc: "run the server on localhost:8080",
      env: {
        PORT: "8080",
        APP_NAME: "MICROSERVE",
      },
      allow: ["net", "env"],
    },
  },
};

export default config;
