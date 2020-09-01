import { Migration } from "https://deno.land/x/nessie/mod.ts";
import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";
import { Schema, Table } from "https://deno.land/x/nessie/qb.ts";

// runs on migrate
export const up: Migration<Schema> = ({ queryBuilder }) => {
  queryBuilder.create("videos", (table: Table) => {
    table.increments("id");
    table.string("owner_id", 80);
    table.string("name", 80);
    table.string("description", 80);
    table.string("transcoding_status", 80);
    table.integer("view_count").default(0);
  });

  return queryBuilder.query;
};

// runs on rollback
export const down: Migration<Schema> = ({ queryBuilder }) => {
  return queryBuilder.drop("videos");
};
