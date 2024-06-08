const currentDate = new Date();
const previousDate = new Date();

// Adjust the current date to UTC-0
currentDate.setHours(currentDate.getHours() - currentDate.getTimezoneOffset() / 60);

// If the current time is before 8a UTC-0, use the data from two days ago
if (currentDate.getUTCHours() < 24) {
  previousDate.setDate(currentDate.getDate() - 2);
} else {
  previousDate.setDate(currentDate.getDate() - 1);
}

const urlCurrentDate = `https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_${currentDate.toISOString().slice(0,10)}.json`;
const urlPreviousDate = `https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_${previousDate.toISOString().slice(0,10)}.json`;
fetch(urlCurrentDate)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      return fetch(urlPreviousDate).then(response => response.json());
    }
  })
  .then(data => {
    const filteredData = data
      .map((d) => ({
        "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
        "End Date": null,
        "Market": d.ticker_name,
        "Open Interest": d.open_interest,
        "Volume": d.daily_volume + d.block_volume,
        "Probability": ((d.high + d.low) / 2).toFixed(2),
        "Question": {
          "Title": d.ticker_name,
          "URL": "https://kalshi.com/markets/" + d.report_ticker,
        },
        "Description": d.report_ticker,
        "Forecasts": null,
        "Link": "https://kalshi.com/markets/" + d.report_ticker,
        "News": {
          "Question": d.report_ticker,
          "URL": "https://kalshi.com/markets/" + d.report_ticker,
        },
        "Status": d.status,
        "Platform": "Kalshi",
      }));

    console.log(JSON.stringify(filteredData, null, 2));
  })
  .catch(error => {
    console.error('Error:', error);
  });