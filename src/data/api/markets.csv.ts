import {csvFormat} from "d3-dsv";
import {run} from "./postgres.ts";

process.stdout.write(
  csvFormat(
    await run(
      (sql) =>
        sql`SELECT 
            *,
            to_char(to_timestamp(timestamp), 'YYYY-MM-DD HH24:MI:SS') AS date
        FROM 
            market_data_with_volatility
        WHERE 
            adj_ticker = 'ADJ-POLYMARKET-WILL-DONALD-TRUMP-WIN-THE-2024-US-PRESIDENTIAL-ELECTION'
        ORDER BY 
          timestamp`
    )
  )
);