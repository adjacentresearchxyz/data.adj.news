import {csvFormat} from "d3-dsv";
import {run} from "./postgres.ts";

process.stdout.write(
  csvFormat(
    await run(
      (sql) =>
        sql`SELECT 
            ticker, 
            adj_ticker, 
            reported_date, 
            end_date, 
            market_slug, 
            open_interest, 
            volume, 
            question, 
            description, 
            forecasts, 
            link, 
            platform, 
            status, 
            market_type, 
            liquidity, 
            rules, 
            probability,
            forecast, 
            result, 
            category,
            platform_id
        FROM 
            markets_data
        WHERE 
            probability > 0 
            AND probability < 100 
            AND end_date >= CURRENT_DATE
            AND EXISTS (
                SELECT 1 
                FROM market_data_with_volatility 
                WHERE market_data_with_volatility.adj_ticker = markets_data.adj_ticker
        )`
     )
  )
);