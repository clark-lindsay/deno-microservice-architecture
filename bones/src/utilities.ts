export function getAppName(): string | undefined {
  const result = Deno.env.get("APP_NAME");
  if (result) {
    return result;
  }
  return undefined;
}

export function getPort(): number | undefined {
  const result = Deno.env.get("PORT");
  if (result !== undefined) {
    return parseInt(result);
  }
  return undefined;
}

export function getDBCredentials(): DBCredentials {
  const result: DBCredentials = {
    user: getEnvironmentVariable("DB_USER"),
    databaseName: getEnvironmentVariable("DB_NAME"),
    hostname: getEnvironmentVariable("DB_HOSTNAME"),
    port: parseInt(getEnvironmentVariable("DB_PORT")),
  };

  return result;

  function getEnvironmentVariable(name: string): string {
    const result = Deno.env.get(name);
    if (result) {
      return result;
    }
    throw new Error(
      `Environment variable ${name} is not defined; Cannot connect to database`
    );
  }
}

export interface DBCredentials {
  user: string;
  databaseName: string;
  hostname: string;
  port: number;
}
