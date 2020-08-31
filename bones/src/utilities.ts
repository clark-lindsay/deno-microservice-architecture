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
