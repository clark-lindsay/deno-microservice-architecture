import { asserts } from "../deps.ts";
const { assertEquals, assertThrows } = asserts;
import { getAppName, getPort, getDBCredentials } from "../src/utilities.ts";

Deno.test({
  name: "getAppName returns undefined if APP_NAME does not exist in env",
  fn: () => {
    Deno.env.delete("APP_NAME");
    assertEquals(getAppName(), undefined);
  },
  sanitizeOps: false,
});

Deno.test({
  name:
    "getAppName returns a string of the value of whatever the APP_NAME env variable is set to",
  fn: () => {
    Deno.env.set("APP_NAME", "test-name");
    assertEquals(getAppName(), "test-name");
  },
  sanitizeOps: false,
});

Deno.test({
  name: "getPort returns undefined if the PORT env variable does not exist",
  fn: () => {
    Deno.env.delete("PORT");
    assertEquals(getPort(), undefined);
  },
  sanitizeOps: false,
});

Deno.test({
  name:
    "getPort returns an integer representation of the env variable PORT, if it exists",
  fn: () => {
    Deno.env.set("PORT", "8000");
    assertEquals(getPort(), 8000);
  },
  sanitizeOps: false,
});

Deno.test({
  name:
    "when an environment variable necessary for database connection is not in the environment, 'getDBCredentials' should throw",
  fn: () => {
    Deno.env.set("DB_NAME", "dbname");
    Deno.env.set("DB_HOSTNAME", "localhost");
    Deno.env.set("DB_PORT", "5432");
    Deno.env.set("MESSAGE_STORE_PORT", "5433");
    Deno.env.set("MESSAGE_STORE_NAME", "message_store");

    Deno.env.delete("DB_USER");
    assertThrows(() => getDBCredentials());

    Deno.env.set("DB_USER", "postgres");
    Deno.env.delete("DB_NAME");
    assertThrows(() => getDBCredentials());

    Deno.env.set("DB_NAME", "dbname");
    Deno.env.delete("DB_HOSTNAME");
    assertThrows(() => getDBCredentials());

    Deno.env.set("DB_HOSTNAME", "localhost");
    Deno.env.delete("DB_PORT");
    assertThrows(() => getDBCredentials());

    Deno.env.set("DB_HOSTNAME", "localhost");
    Deno.env.delete("MESSAGE_STORE_PORT");
    assertThrows(() => getDBCredentials());

    Deno.env.set("MESSAGE_STORE_PORT", "5433");
    Deno.env.delete("MESSAGE_STORE_NAME");
    assertThrows(() => getDBCredentials());
  },
  sanitizeOps: false,
});

Deno.test({
  name:
    "when all environment vars are set for the DB, 'getDBCredentials' should return a correct DBCredentials object",
  fn: () => {
    Deno.env.set("DB_USER", "postgres");
    Deno.env.set("DB_NAME", "dbname");
    Deno.env.set("DB_HOSTNAME", "localhost");
    Deno.env.set("DB_PORT", "5432");
    Deno.env.set("MESSAGE_STORE_NAME", "message_store");
    Deno.env.set("MESSAGE_STORE_PORT", "5433");

    assertEquals(getDBCredentials(), {
      user: "postgres",
      databaseName: "dbname",
      hostname: "localhost",
      port: 5432,
      messageStoreName: "message_store",
      messageStorePort: 5433,
    });
  },
  sanitizeOps: false,
});
