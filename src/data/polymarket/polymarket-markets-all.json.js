// ------- POLYMARKET MARKETS -------
// /markets?active=true&_sort=volume:desc&_limit=-1
// "data": [
//   {
//     "enable_order_book": true,
//     "active": true,
//     "closed": false,
//     "archived": false,
//     "accepting_orders": true,
//     "accepting_order_timestamp": null,
//     "minimum_order_size": 5,
//     "minimum_tick_size": 0.001,
//     "condition_id": "0x12a0cb60174abc437bf1178367c72d11f069e1a3add20b148fb0ab4279b772b2",
//     "question_id": "0x71489e408cd07bfb310f01af681ed3503295ffefdb09a644c34fa3f9fe3f420c",
//     "question": "[Single Market] Will Ron DeSantis win the U.S. 2024 Republican presidential nomination?",
//     "description": "This market will resolve to “Yes” if Ronald Dion de Santis wins the 2024 nomination of the Republican Party for U.S. president. Otherwise, this market will resolve to “No”.\n\nThe resolution source for this market will be a consensus of official GOP sources, including https://www.gop.com.\n\nAny replacement of the nominee before election day will not change the resolution of the market.",
//     "market_slug": "will-ron-desantis-win-the-us-2024-republican-presidential-nomination",
//     "end_date_iso": "2024-09-10T00:00:00Z",
//     "game_start_time": null,
//     "seconds_delay": 0,
//     "fpmm": "0x84834141F76bDb7EE72A9E67Ca7Bd1e849288C3A",
//     "maker_base_fee": 0,
//     "taker_base_fee": 0,
//     "notifications_enabled": true,
//     "neg_risk": false,
//     "neg_risk_market_id": "",
//     "neg_risk_request_id": "",
//     "icon": "https://polymarket-upload.s3.us-east-2.amazonaws.com/single-market-will-ron-desantis-win-the-us-2024-republican-presidential-nomination-d7f2b452-e8b6-4f5d-a82f-417c1eaa72e7.png",
//     "image": "https://polymarket-upload.s3.us-east-2.amazonaws.com/single-market-will-ron-desantis-win-the-us-2024-republican-presidential-nomination-d7f2b452-e8b6-4f5d-a82f-417c1eaa72e7.png",
//     "rewards": {
//       "rates": [
//         {
//           "asset_address": "",
//           "rewards_daily_rate": 0
//         }
//       ],
//       "min_size": 0,
//       "max_spread": 0
//     },
//     "is_50_50_outcome": false,
//     "tokens": [
//       {
//         "token_id": "10715043962341292242163832255523703116280692082153281340642602592290195499485",
//         "outcome": "Yes",
//         "price": 0.043,
//         "winner": false
//       },
//       {
//         "token_id": "80085489243215790077454313513728486445319747473476157602131800551595373270758",
//         "outcome": "No",
//         "price": 0.957,
//         "winner": false
//       }
//     ],
//     "tags": [
//       "2024 presidential election",
//       "politics",
//       "republican party",
//       "ron desantis"
//     ]
//   },
//   ...
// ]
let data = [{}];

async function getData(next_cursor) {
  const response = await fetch('https://clob.polymarket.com/markets?active=true&_sort=volume:desc&_limit=-1?next_cursor=' + next_cursor, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://polymarket.com/',
    }
  }).then(res => res.json());

  const paginatedData = response.data.map((market) => ({
      "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
      "End Date": new Date(market.end_date_iso).toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
      "Market": market.market_slug,
      "Open Interest": null, // for $ markets, @TODO This should be able to be pulled 
      "Volume": null, // @TODO This should be able to be pulled 
      "Probability": market.tokens.map((token) => token.outcome === "Yes" ? token.price : null),
      "Question": market.question,
      "Description": market.description,
      "Forecasts": null, // for non $ markets
      "Link": "https://polymarket.com/market/" + market.market_slug,
      "News": {
        "Question": market.question,
        "URL": "https://polymarket.com/market/" + market.market_slug,
      }, // in order to render news we need question and url
      "Platform": "Polymarket",
  }));

  data.push(paginatedData);

  // store the cursor for pagination
  let cursor = data.next_cursor;

  // if the cursor is not equal to "LTE=", then there are more pages to fetch see https://docs.polymarket.com/#get-markets
  if (cursor !== "LTE=") {
    setTimeout(() => getData(cursor), 10000); // wait 10 seconds before fetching the next page
  }
}

getData("");
process.stdout.write(JSON.stringify(data, null, 2));