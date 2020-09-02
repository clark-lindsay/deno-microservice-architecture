import { DenonConfig } from "https://deno.land/x/denon@2.3.2/mod.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run src/server.ts",
      desc: "run the server on localhost:8080",
      env: {
        PORT: "8080",
        APP_NAME: "MICROSERVE",
        DATABASE_URL: "0.0.0.0:5432",
      },
      allow: ["net", "env"],
    },
    inspect: {
      cmd: "deno run --inspect-brk src/server.ts",
      desc: "run the server on localhost:8080",
      env: {
        PORT: "8080",
        APP_NAME: "MICROSERVE",
        DATABASE_URL: "0.0.0.0:5432",
      },
      allow: ["net", "env"],
    },
    test: {
      cmd: "deno test",
      desc: "run all the tests",
      env: {
        PORT: "8080",
        APP_NAME: "MICROSERVE",
        DATABASE_URL: "0.0.0.0:5432",
      },
      allow: ["net", "env"],
      watch: false,
    },
  },
};

export default config;
