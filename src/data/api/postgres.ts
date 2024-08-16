import "dotenv/config";
import type {Row, Sql} from "postgres";
import postgres from "postgres";

const POSTGRES_URL = process.env.NEXT_PUBLIC_POSTGRES_URL;

if (!POSTGRES_URL) throw new Error("Missing POSTGRES_URL");

// Warning: you may wish to specify a self-signed certificate rather than
// disabling certificate verification via rejectUnauthorized: false as below.
// See https://github.com/porsager/postgres/blob/master/README.md#ssl for more.
export async function run<T extends Row[]>(f: (sql: Sql) => Promise<T>): Promise<T> {
  const sql = postgres(POSTGRES_URL!, {ssl: {rejectUnauthorized: false}});
  try {
    return await f(sql);
  } finally {
    await sql.end();
  }
}