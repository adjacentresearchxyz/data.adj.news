async function fetchAllMarkets() {
  let lastId;
  let allMarkets = [];

  while (true) {
    const url = `https://api.manifold.markets/v0/markets?limit=1000${lastId ? `&before=${lastId}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length < 1000) {
      allMarkets = allMarkets.concat(data);
      break;
    }

    lastId = data[data.length - 1].id;
    allMarkets = allMarkets.concat(data);
  }

  return allMarkets.map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.slug,
    "Open Interest": null,
    "Volume": d.volume,
    "Probability": isNaN(d.probability * 100) ? "" : (d.probability * 100).toFixed(2),
    "Question": {
      "Title": d.question,
      "URL": d.url,
    },
    "Description": d.question,
    "Forecasts": d.uniqueBettorCount,
    "Link": d.url,
    "News": {
      "Question": d.question,
      "URL": d.url,
    },
    "Status": d.isResolved ? "finalized" : "active",
    "Platform": "Manifold",
  }));
}

fetchAllMarkets()
  .then(markets => process.stdout.write(JSON.stringify(markets)))
  .catch(error => console.error(error));