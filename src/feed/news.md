```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('market');
```

```js
  // clean up the market query parameter
  const allowedChars = /[^a-zA-Z0-9 ,.?!]/g;
  let market_filtered = market.replace(allowedChars, '');
  market_filtered = market_filtered.trim();

  // Fetch news data
  const response = await fetch(`https://api.data.adj.news/api/news/${market_filtered}`);
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
// Iterate over markets for each platform and try and match the market to the news query to display odds
const allMarkets = [...metaculusMarkets, ...manifoldMarkets, ...polymarketMarkets, ...kalshiMarkets];
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
</div>