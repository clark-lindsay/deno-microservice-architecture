import { Migration, Schema, Table } from "../../deps.ts";

export const up: Migration<Schema> = ({ queryBuilder }) => {
  queryBuilder.create("pages", (table: Table) => {
    table.string("page_name", 80).primary();
    table.jsonb("page_data").default({});
  });

  return queryBuilder.query;
};

export const down: Migration<Schema> = ({ queryBuilder }) => {
  return queryBuilder.drop("pages", true);
};
