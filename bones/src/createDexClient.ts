import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

export async function createDexClient({
  connectcionString,
  migrationsTableName,
}: DBConnectionArgs): Promise<any> {
  console.log(connectcionString);
  const client = Dex({ connection: connectcionString });
  const migrationOptions = {
    tableName: migrationsTableName || "dex_migrations",
  };

  console.log(`DB Client: ${client}`);
  return Promise.resolve(client.migrate.latest(migrationOptions)).then(
    () => client
  );
}

interface DBConnectionArgs {
  connectcionString: string;
  migrationsTableName?: string;
}
