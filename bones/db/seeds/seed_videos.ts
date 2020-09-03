import { Seed } from "https://deno.land/x/nessie/mod.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";

/** Runs on seed */
export const run: Seed = () => {
  return Dex({ client: "postgres" })("videos")
    .insert({
      owner_id: "Girlfriend Reviews",
      name: "Should your boyfriend write an app in Deno?",
      description: "Hard to say...",
      transcoding_status: "working on it",
      view_count: 42,
    })
    .toString();
};
