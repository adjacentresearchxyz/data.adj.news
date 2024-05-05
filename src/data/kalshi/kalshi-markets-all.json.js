// ------- Kalshi MARKETS -------
// https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_<date>.json
// [
//   {
//     "date": "2023-01-01",
//     "ticker_name": "CPTPP-23JAN4",
//     "report_ticker": "CPTPP",
//     "payout_type": "Binary Option",
//     "open_interest": 5499,
//     "daily_volume": 0,
//     "block_volume": 0,
//     "high": 2,
//     "low": 2,
//     "status": "active"
//   },
// ...
// ]

let data = [{}];

async function getDatedData(date) {
  const url = `https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_${date}.json`;
  const response = await fetch(url).then(res => res.json());
  const finalizedMarkets = response.filter(market => market.status === 'finalized');
  const mappedMarkets = finalizedMarkets.map(market => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": market.ticker_name,
    "Open Interest": market.open_interest, // for $ markets
    "Volume": market.daily_volume + market.block_volume,
    "Probability": market.tokens.map((token) => token.outcome === "Yes" ? token.price : null),
    "Question": null,
    "Description": null,
    "Forecasts": null, // for non $ markets
    "Link": "https://kalshi.com/markets/" + market.ticker_name,
    "News": {
      "Question": null,
      "URL": "https://kalshi.com/markets/" + market.ticker_name,
    }, // in order to render news we need question and url
    "Platform": "Kalshi",
  }));
  data.push(...mappedMarkets);
}

async function getData(onlyYesterday = false) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (onlyYesterday) {
    await getDatedData(yesterday.toISOString().slice(0, 10));
  } else {
    for (let date = yesterday; date >= new Date('2021-07-01'); date.setDate(date.getDate() - 1)) {
      await getDatedData(date.toISOString().slice(0, 10));
      await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds before fetching the next date
    }
  }
}  

getData();
process.stdout.write(JSON.stringify(data, null, 2));