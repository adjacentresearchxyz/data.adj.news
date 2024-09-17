import duckdb
import os

token = os.environ.get('MOTHERDUCK_TOKEN')
con = duckdb.connect(f'md:adjacent?{token}')
con.sql("COPY (SELECT ticker, adj_ticker, end_date, question, description, status, rules, category, probability FROM markets_data WHERE current_date >= end_date ORDER BY end_date DESC) TO STDOUT (FORMAT 'parquet', COMPRESSION 'gzip');")