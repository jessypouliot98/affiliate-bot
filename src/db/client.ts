import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

export const sqlClient = createClient({
  url: "file://local.db",
});
export const drizzleClient = drizzle(sqlClient);