import duckdb

con = duckdb.connect('md:adjacent?motherduck_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imx1Y2FzQGFkamFjZW50cmVzZWFyY2gueHl6Iiwic2Vzc2lvbiI6Imx1Y2FzLmFkamFjZW50cmVzZWFyY2gueHl6IiwicGF0Ijoia2lCZUl5dkhWYlBDbGNmczNMN2tzQWpwLUs4dFRSYlhpYlRTdWw5OXF6USIsInVzZXJJZCI6ImU2YTI5ZDc0LWZlY2QtNDczZS1iOTA4LTRlNmNhZDJiZDJlMyIsImlzcyI6Im1kX3BhdCIsImlhdCI6MTcyNjQyNDg5NH0.d6xB0brz82hRXVWYpv2H2r9nkjqwlcPQRNXcBJbzhUk')
con.sql("COPY (SELECT * FROM trades ORDER BY trades.reported_date DESC) TO STDOUT (FORMAT 'parquet', COMPRESSION 'gzip');")