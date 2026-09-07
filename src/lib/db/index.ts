import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://localhost:5432/postgres";

// Supabase session pooler: a small persistent pool is ideal for next dev/start.
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 15,
  ssl: "prefer",
  prepare: false,
});

export const db = drizzle(client, { schema });
export { schema };
