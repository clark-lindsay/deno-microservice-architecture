import { assertEquals } from "http://deno.land/std@0.66.0/testing/asserts.ts";
import { getAppName, getPort } from "../src/utilities.ts";

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
