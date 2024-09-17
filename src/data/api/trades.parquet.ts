import duckdb
import os

token = os.environ.get('MOTHERDUCK_TOKEN')
con = duckdb.connect(f'md:adjacent?{token}')
con.sql("COPY (SELECT * FROM trades ORDER BY trades.reported_date DESC) TO STDOUT (FORMAT 'parquet', COMPRESSION 'gzip');")