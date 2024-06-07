async function fetchAllMarkets() {
    let nextCursor;
    let allMarkets = [];
  
    while (true) {
      const url = `https://clob.polymarket.com/markets?active=true&_sort=volume:desc&_limit=-1${nextCursor ? `&next_cursor=${nextCursor}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.next_cursor === 'LTE=') {
        allMarkets = allMarkets.concat(data.data);
        break;
      }
  
      nextCursor = data.next_cursor;
      allMarkets = allMarkets.concat(data.data);
    }
  
    return allMarkets.map((d) => ({
      "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
      "End Date": d.end_date_iso ? new Date(d.end_date_iso).toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16) : null,
      "Market": d.market_slug,
      "Open Interest": null,
      "Volume": null,
      "Probability": isNaN(d.tokens[0].price.toFixed(2) * 100) ? "" : (d.tokens[0].price.toFixed(2) * 100),
      "Question": {
        "Title": d.question,
        "URL": "https://polymarket.com/market/" + d.market_slug,
      },
      "Description": d.description,
      "Forecasts": null,
      "Link": "https://polymarket.com/market/" + d.market_slug,
      "News": {
        "Question": d.question,
        "URL": "https://polymarket.com/market/" + d.market_slug,
      },
      "Status": d.end_date_iso ? (new Date(d.end_date_iso) < new Date() ? "finalized" : "active") : "active",
      "Platform": "Polymarket",
    }));
  }
  
  fetchAllMarkets()
    .then(markets => process.stdout.write(JSON.stringify(markets)))
    .catch(error => console.error(error));