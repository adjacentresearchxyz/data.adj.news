import { run } from "./postgres.ts";
import * as Arrow from "apache-arrow";
import * as Parquet from "parquet-wasm";

async function fetchData() {
  return await run(
    (sql) =>
      sql`SELECT
          md.adj_ticker,
          md.status,
          t.midpoint as probability,
          COALESCE(
            mvi.stddev_probability / mvi.avg_probability,
            0::double precision
          ) as daily_volatility,
          t."timestamp",
          trade_date
        FROM
          markets_data md
        JOIN trades t ON md.adj_ticker::text = t.adj_ticker
        LEFT JOIN (
          SELECT
            adj_ticker,
            trade_date,
            avg_probability,
            stddev_probability,
            num_trades,
            rolling_30_day_stddev,
            rolling_30_day_stddev / avg_probability * SQRT(365::double precision) * 100::double precision as mvi
          FROM (
            SELECT
              dd.adj_ticker,
              dd.trade_date,
              dd.avg_probability,
              dd.stddev_probability,
              dd.num_trades,
              AVG(dd.stddev_probability) OVER (
                PARTITION BY dd.adj_ticker
                ORDER BY dd.trade_date
                ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
              ) as rolling_30_day_stddev
            FROM (
              SELECT
                trades.adj_ticker,
                TO_TIMESTAMP(trades."timestamp"::double precision) as trade_date,
                AVG(trades.midpoint) as avg_probability,
                STDDEV(trades.midpoint) as stddev_probability,
                COUNT(*) as num_trades
              FROM
                trades
              GROUP BY
                trades.adj_ticker,
                TO_TIMESTAMP(trades."timestamp"::double precision)
            ) dd
          ) rolling_volatility
        ) mvi ON md.adj_ticker::text = mvi.adj_ticker
        AND TO_TIMESTAMP(t."timestamp"::double precision) = mvi.trade_date
        ORDER by timestamp`
  );
}

async function main() {
  try {
    const data = await fetchData();

    // Define the Arrow schema
    const schema = new Arrow.Schema([
      Arrow.Field.new('adj_ticker', new Arrow.Utf8()),
      Arrow.Field.new('status', new Arrow.Utf8()),
      Arrow.Field.new('probability', new Arrow.Float64()),
      Arrow.Field.new('daily_volatility', new Arrow.Float64()),
      Arrow.Field.new('timestamp', new Arrow.Int64()),
    ]);

    // Create an Arrow table from the data
    const table = Arrow.tableFromArrays({
      adj_ticker: data.map(d => d.adj_ticker),
      status: data.map(d => d.status),
      probability: data.map(d => d.probability),
      daily_volatility: data.map(d => d.daily_volatility),
      timestamp: data.map(d => d.timestamp),
    }, schema);

    // Convert Arrow table to Parquet table
    const parquetTable = Parquet.Table.fromIPCStream(Arrow.tableToIPC(table, "stream"));

    // Create WriterProperties with ZSTD compression
    const writerProperties = new Parquet.WriterPropertiesBuilder()
      .setCompression(Parquet.Compression.ZSTD)
      .build();

    // Write the Parquet table to a buffer
    const parquetData = Parquet.writeParquet(parquetTable, writerProperties);
    
    // Write the buffer to stdout
    process.stdout.write(parquetData);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exit(1);
  }
}

main();