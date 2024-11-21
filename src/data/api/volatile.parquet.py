import duckdb
import os

token = os.environ.get('MOTHERDUCK_TOKEN')
con = duckdb.connect(f'md:adjacent?{token}')
con.sql("""
        COPY (WITH ranked_trades AS (
		SELECT 
			t.adj_ticker,
			t.reported_date,
			t.midpoint,
			ROW_NUMBER() OVER (PARTITION BY t.adj_ticker ORDER BY t.reported_date DESC) as rn
		FROM adjacent.trades t
		),
		latest_trades AS (
		SELECT 
		adj_ticker,
		reported_date,
		midpoint,
		rn
		FROM ranked_trades
		WHERE rn <= 2
		),
		time_diffs AS (
		SELECT 
			adj_ticker,
			MAX(reported_date) - MIN(reported_date) as time_diff,
			MAX(CASE WHEN rn = 1 THEN midpoint END) as latest_price,
			MAX(CASE WHEN rn = 2 THEN midpoint END) as previous_price,
			MAX(CASE WHEN rn = 2 THEN midpoint END) - MAX(CASE WHEN rn = 1 THEN midpoint END) as price_diff
		FROM latest_trades
		GROUP BY adj_ticker
		)
		SELECT
		ticker,
		reported_date,
		end_date,
		status,
		question,
		description,
		rules,
		category,
		platform,
		td.time_diff,
		td.latest_price,
		td.previous_price,
		td.price_diff
		FROM adjacent.markets_data m
		JOIN time_diffs td ON m.adj_ticker = td.adj_ticker
		WHERE (status = 'active' or status = 'true') 
		 AND current_date <= m.end_date
         AND td.latest_price < 95 -- filter out ~settled markets
         AND td.latest_price > 5 -- filter out ~settled markets
         AND td.previous_price > 5
         -- AND price_diff > 10 -- need to be over a 10% move to be "breaking"
		ORDER BY td.price_diff) TO STDOUT (FORMAT 'parquet', COMPRESSION 'gzip');
""")