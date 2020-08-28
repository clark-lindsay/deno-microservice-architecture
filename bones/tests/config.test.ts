import { assertThrows } from "http://deno.land/std@0.66.0/testing/asserts.ts";

import { createConfig } from "../src/config.ts";

Deno.test({
  name: "when 'DATABASE_URL' is not in the env, it should throw",
  fn: () => {
    Deno.env.delete("DATABASE_URL");
    assertThrows(() => createConfig());
  },
});
