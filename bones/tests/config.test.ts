import { assertThrowsAsync } from "http://deno.land/std@0.66.0/testing/asserts.ts";

import { initializeDB } from "../src/config.ts";

Deno.test({
  name: "when 'DATABASE_URL' is not in the env, it should throw",
  fn: async () => {
    Deno.env.delete("DATABASE_URL");
    assertThrowsAsync(async () => initializeDB());
  },
  sanitizeResources: false,
});
