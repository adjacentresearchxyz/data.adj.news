import {csvFormat} from "d3-dsv";
import {run} from "./postgres.ts";

process.stdout.write(
  csvFormat(
    await run(
      (sql) =>
        sql`SELECT
              adj_ticker,
              probability,
              daily_volatility,
              to_timestamp(timestamp) as date
            from market_data_with_volatility
            order by timestamp;`
    )
  )
);