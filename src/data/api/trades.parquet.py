import duckdb
import os

token = os.environ.get('MOTHERDUCK_TOKEN')
con = duckdb.connect(f'md:adjacent?{token}')
con.sql("""
        COPY (SELECT trades.adj_ticker, midpoint, trades.reported_date FROM trades JOIN markets_data ON trades.adj_ticker = markets_data.adj_ticker WHERE (markets_data.status = 'active' OR markets_data.status = 'true') AND current_date <= end_date ORDER BY end_date DESC) TO STDOUT (FORMAT 'parquet', COMPRESSION 'zstd');
""")