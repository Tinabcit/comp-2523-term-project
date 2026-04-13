// add the changes and make sure to work the changes and the code works with the correct paths.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "#/dal/db/schema";

export function dbConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required.");
  }
  const neonClient = neon(databaseUrl);
  return drizzle(neonClient, { schema });
}

export type DbClient = ReturnType<typeof dbConnection>;
