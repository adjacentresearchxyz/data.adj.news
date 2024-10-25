import duckdb
import os

token = os.environ.get('MOTHERDUCK_TOKEN')
con = duckdb.connect(f'md:adjacent?{token}')
con.sql("COPY (SELECT ticker, adj_ticker, end_date, question, description, status, rules, category, probability, platform FROM markets_data WHERE (markets_data.status = 'active' OR markets_data.status = 'true') AND current_date <= end_date ORDER BY end_date DESC) TO STDOUT (FORMAT 'parquet', COMPRESSION 'gzip');")