```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('market');
```

```js
  // Fetch news data
  const response = await fetch(`https://api.adj.news/api/news/${market}`);
  // const response = await fetch(`http://localhost:8787/api/news/${market}`);
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
    "Date": d.node.fetchedStr,
    "ID": d.node.id,
    "Title": d.node.title,
    "News": d.node.title,
    "URL": d.node.url,
    "Probability": d.node.options[0].probability * 100,
    "Forecasts": d.node.qualityIndicators.numForecasts,
    "Stars": d.node.qualityIndicators.stars,
    "Platform": "Metaculus",
  }));
```

```js
const manifoldMarketsClean = manifoldMarkets
  .filter(d => d.volume > 0) // Filter out markets with no volume
  .filter(d => d.probability > 0) // Filter out markets with no probability
  .map((d) => ({
    "Slug": {
        "slug": d.slug,
        "url": d.url,
    },
    "Title": d.question,
    "News": {
      "question": d.question,
      "url": d.url,
    },
    "URL": d.url,
    "Probability": d.probability * 100,
    "Unique Bettor Count": d.uniqueBettorCount,
    "Volume": d.volume,
    "Platform": "Manifold",
  }));
```

```js
const polymarketMarketsClean = polymarketMarkets.data
  .filter(d => d.active) // Filter out inactive markets
  .filter(d => !d.archived) // Filter out archived markets
  .map((d) => ({
    "Date": new Date().toLocaleDateString(),
    "ID": d.market_slug,
    "Title": d.question,
    "News": d.question,
    "URL": "https://polymarket.com/market/" + d.market_slug,
    "Description": d.description,
    "Probability": d.tokens[0].price * 100,
    "Platform": "Polymarket",
  }));
```

```js
// Iterate over markets for each platform and try and match the market to the news query to display odds
const allMarkets = [...metaculusMarketsClean, ...manifoldMarketsClean, ...polymarketMarketsClean];
const fullMarket = allMarkets.find(platformMarket => platformMarket.Title.toLowerCase().includes(market.toLowerCase()));
```

<div>
  <h3>News</h3>
  Powered by <a href="https://exa.ai" target="_blank" class="dotted">Exa</a>
  ${
    fullMarket ? htl.html`<p>> <a href="${fullMarket.URL}" class="dotted" target="_blank">${market}</a></p>` : ""
  }
  ${
    fullMarket ? htl.html`<p>> Forecasting odds: ${fullMarket.Probability.toFixed(2)}%</p>` : ""
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
  ${
    fullMarket ? htl.html`<p>Explore the full news feed at <a href="https://exa.ai/search?c=all&q=${market}" class="dotted" target="_blank">Exa</a></p>` : ""
  }
</div>