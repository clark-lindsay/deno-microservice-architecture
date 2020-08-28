import Dex from "https://raw.githubusercontent.com/denjucks/dex/master/mod.ts";

export async function createDexClient({
  connectcionString,
  migrationsTableName,
}: DBConnectionArgs): Promise<any> {
  const client = Dex({ connection: connectcionString });
  const migrationOptions = {
    tableName: migrationsTableName || "dex_migrations",
  };

  return Promise.resolve(client.migrate.latest(migrationOptions)).then(
    () => client
  );
}

interface DBConnectionArgs {
  connectcionString: string;
  migrationsTableName?: string;
}
