# adj.news Data

Data for [adj.news](adj.news)

## Data
We use Framework from Observable to collect data. Framework is a static site generator and we run 15min cron job in cloudflare to update the data for the free tier. This runs every 15min and gets just the current day's data, the historical data is collected from a Postgres database.

Initially you will have to get historical data with scripts like `src/data/kalshi/kalshi-markets-all.json.js` run this (it will take a few hours), then take the `.json` file and use wrangler to upload the data into D1 `wrangler d1 execute d1-example --command "INSERT ... `