import { DenonConfig } from "https://deno.land/x/denon@2.3.2/mod.ts";

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
    test: {
      cmd: "deno test",
      desc: "run all the tests",
      env: {
        PORT: "8080",
        APP_NAME: "MICROSERVE",
      },
      allow: ["net", "env"],
      watch: false,
    },
  },
};

export default config;
