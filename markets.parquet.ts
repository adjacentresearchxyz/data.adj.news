import { run } from "./postgres.ts";
import * as Arrow from "apache-arrow";
import * as Parquet from "parquet-wasm";

async function fetchData() {
  return await run(
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
          AND status = 'active'
          AND EXISTS (
              SELECT 1 
              FROM market_data_with_volatility 
              WHERE market_data_with_volatility.adj_ticker = markets_data.adj_ticker
      )`
  );
}

async function main() {
  try {
    const data = await fetchData();

    // Define the Arrow schema
    const schema = new Arrow.Schema([
      Arrow.Field.new('ticker', new Arrow.Utf8()),
      Arrow.Field.new('adj_ticker', new Arrow.Utf8()),
      Arrow.Field.new('reported_date', new Arrow.TimestampMillisecond()),
      Arrow.Field.new('end_date', new Arrow.TimestampMillisecond()),
      Arrow.Field.new('market_slug', new Arrow.Utf8()),
      Arrow.Field.new('open_interest', new Arrow.Int64(), true),
      Arrow.Field.new('volume', new Arrow.Int64(), true),
      Arrow.Field.new('question', new Arrow.Utf8()),
      Arrow.Field.new('description', new Arrow.Utf8()),
      Arrow.Field.new('forecasts', new Arrow.Utf8(), true),
      Arrow.Field.new('link', new Arrow.Utf8()),
      Arrow.Field.new('platform', new Arrow.Utf8()),
      Arrow.Field.new('status', new Arrow.Utf8()),
      Arrow.Field.new('market_type', new Arrow.Utf8()),
      Arrow.Field.new('liquidity', new Arrow.Float64(), true),
      Arrow.Field.new('rules', new Arrow.Utf8(), true),
      Arrow.Field.new('probability', new Arrow.Float64()),
      Arrow.Field.new('forecast', new Arrow.Utf8(), true),
      Arrow.Field.new('result', new Arrow.Utf8(), true),
      Arrow.Field.new('category', new Arrow.Utf8()),
      Arrow.Field.new('platform_id', new Arrow.Utf8())
    ]);

    // Create an Arrow table from the data
    const table = Arrow.tableFromArrays({
      ticker: data.map(d => d.ticker),
      adj_ticker: data.map(d => d.adj_ticker),
      reported_date: data.map(d => new Date(d.reported_date).getTime()),
      end_date: data.map(d => new Date(d.end_date).getTime()),
      market_slug: data.map(d => d.market_slug),
      open_interest: data.map(d => d.open_interest ? BigInt(d.open_interest) : null),
      volume: data.map(d => d.volume ? BigInt(d.volume) : null),
      question: data.map(d => d.question),
      description: data.map(d => d.description),
      forecasts: data.map(d => d.forecasts),
      link: data.map(d => d.link),
      platform: data.map(d => d.platform),
      status: data.map(d => d.status),
      market_type: data.map(d => d.market_type),
      liquidity: data.map(d => d.liquidity),
      rules: data.map(d => d.rules),
      probability: data.map(d => d.probability),
      forecast: data.map(d => d.forecast),
      result: data.map(d => d.result),
      category: data.map(d => d.category),
      platform_id: data.map(d => d.platform_id)
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