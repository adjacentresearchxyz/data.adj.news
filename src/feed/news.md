```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('market');
```

```js
  // Fetch news data
  const response = await fetch(`https://api.adj.news/api/news/${market}`);
  // const response = await fetch(`https://localhost:8787/api/news/${market}`)
  const data = await response.json();

  const news = await data.results
  .filter(result => result.title && result.publishedDate)
  .map(result => ({
    Article: {
      title: result.title,
      url: result.url
    },
    Published: result.publishedDate,
    Source: result.author
  }))
```

```js
//
// Load data snapshots
//

// Kalshi Markets
const kalshiMarkets = FileAttachment("../data/kalshi/kalshi-markets.json").json();

// Metaculus Markets 
const metaculusMarkets = FileAttachment("../data/metaculus/metaculus-markets.json").json();

// Manifold Markets 
const manifoldMarkets = FileAttachment("../data/manifold/manifold-markets.json").json();

// Polymarket Markets 
const polymarketMarkets = FileAttachment("../data/polymarket/polymarket-markets.json").json();
```

```js
const metaculusMarketsClean = metaculusMarkets.data.questions.edges
  .filter(d => d.node.options)
  .filter(d => d.node.options.length === 2) // binary markets
  .filter(d => d.node.options.every(o => o.probability !== null)) // all probabilities
  .filter(d => d.node.description) // description
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.node.id,
    "Open Interest": null,
    "Volume": null,
    "Probability": (d.node.options[0].probability * 100).toFixed(2),
    "Question": {
      "Title": d.node.title,
      "URL": d.node.url,
    },
    "Description": d.node.description,
    "Forecasts": d.node.qualityIndicators.numForecasts,
    "Link": d.node.url,
    "News": {
      "Question": d.node.title,
      "URL": d.node.url,
    },
    "Status": null, // @TODO This should be able to be pulled
    "Platform": "Metaculus",
  }));
```

```js
const manifoldMarketsClean = manifoldMarkets
  .filter(d => d.volume > 0) // Filter out markets with no volume
  .filter(d => d.probability > 0) // Filter out markets with no probability
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.slug,
    "Open Interest": null,
    "Volume": d.volume,
    "Probability": (d.probability * 100).toFixed(2),
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
```

```js
const polymarketMarketsClean = polymarketMarkets.data
  .filter(d => d.active) // Filter out inactive markets
  .filter(d => !d.archived) // Filter out archived markets
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": new Date(d.end_date_iso).toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "Market": d.market_slug,
    "Open Interest": null, // for $ markets, @TODO This should be able to be pulled 
    "Volume": null, // @TODO This should be able to be pulled 
    "Probability": d.tokens[0].price.toFixed(2) * 100,
    "Question": {
      "Title": d.question,
      "URL": "https://polymarket.com/market/" + d.market_slug,
    },
    "Description": d.description,
    "Forecasts": null, // for non $ markets
    "Link": "https://polymarket.com/market/" + d.market_slug,
    "News": {
      "Question": d.question,
      "URL": "https://polymarket.com/market/" + d.market_slug,
    }, // in order to render news we need question and url
    "Status": new Date(d.end_date_iso) < new Date() ? "finalized" : "active", // if end date is in the past, market is finalized
    "Platform": "Polymarket",
  }));
```

```js
const kalshiMarketsClean = kalshiMarkets
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.ticker_name,
    "Open Interest": d.open_interest,
    "Volume": d.daily_volume + d.block_volume,
    "Probability": ((d.high + d.low) / 2).toFixed(2), // avg. of high and low
    "Question": {
      "Title": d.ticker_name, // @TODO This should be able to be pulled
      "URL": "https://kalshi.com/markets/" + d.report_ticker,
    },
    "Description": d.report_ticker, // @TODO This should be able to be pulled
    "Forecasts": null,
    "Link": "https://kalshi.com/markets/" + d.report_ticker,
    "News": {
      "Question": d.ticker_name,
      "URL": "https://kalshi.com/markets/" + d.report_ticker,
    },
    "Status": d.status,
    "Platform": "Kalshi",
  }));
```

```js
// Iterate over markets for each platform and try and match the market to the news query to display odds
const allMarkets = [...metaculusMarketsClean, ...manifoldMarketsClean, ...polymarketMarketsClean, ...kalshiMarketsClean];
const fullMarket = allMarkets.find(platformMarket => platformMarket.Question.Title.toLowerCase().includes(market.toLowerCase()));
```

<div>
  <h3>News</h3>
  Powered by <a href="https://exa.ai" target="_blank" class="dotted">Exa</a>
  ${
    fullMarket ? htl.html`<p>> <a href="${fullMarket.Link}" class="dotted" target="_blank">${market}</a></p>` : ""
  }
  ${
    fullMarket ? htl.html`<p>> Forecasting odds: ${fullMarket.Probability}%</p>` : ""
  }
  <div>
    ${news.map(d => htl.html`
      <li>
      <a href="${d.Article.url}" target="_blank">${d.Article.title.substring(0,75) + "..."}</a>
      </li>
    `)}
  </div>
  <!-- <div>
      ${Inputs.table(news, {
      rows: 30, 
      sort: "Comments", 
      reverse: true,
      layout: "auto",
      columns: ["Article"],
      header: {
        "Article": "",
      },
      format: {
        "Article": d => htl.html`<a href="${d.url}" target="_blank">${d.title.substring(0,50) + "..."}</a>`,
        "Published": d => d,
        "Source": d => d.substring(0,25)
      }
    })}
  </div> -->
</div>