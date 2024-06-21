```js
//
// Load data snapshots
//

// Kalshi Markets 
const kalshiMarkets = FileAttachment("./data/kalshi/kalshi-markets.json").json();

// Metaculus Markets 
const metaculusMarkets = FileAttachment("./data/metaculus/metaculus-markets.json").json();

// Manifold Markets 
const manifoldMarketsZip = FileAttachment("./data/manifold/manifold-markets.zip").zip();
const manifoldMarkets = FileAttachment("./data/manifold/manifold-markets/markets.json").json();

// Polymarket Markets 
const polymarketMarkets = FileAttachment("./data/polymarket/polymarket-markets.json").json();
```

```js
// Aggregate all markets
const allMarkets = [...kalshiMarkets, ...polymarketMarkets, ...metaculusMarkets, ...manifoldMarkets];
```

```js
  // Get the search query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
```

<style>
    .search-results {
        text-align: center; /* Center content horizontally */
    }
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Adjust the height as needed */
    }

    input {
        font-family: monospace, sans-serif;
        width: 35%; /* Corrected width to 35% */
        height: 44px;
        padding: 10px 20px;
        font-size: 16px;
        border: 1px solid #dfe1e5;
        border-radius: 24px;
        box-shadow: 0 1px 6px rgba(32,33,36,0.28);
        margin-bottom: 20px;
    }

    input:focus {
        outline: none;
        box-shadow: 0 1px 6px rgba(32,33,36,0.28), 0 0 0 2px rgba(26,115,232,0.3);
        border-color: transparent;
    }

    output {
        display: none;
    }

.news-card {
    background-color: #ffffff;
    opacity: 85%;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    max-width: 300px;
    width: 100%;
    margin: 0 auto;
    display: inline-block;
    height: 10em;
    position: relative;
    z-index: 1;
}

.news-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-image: 
        radial-gradient(circle, #0003 1px, transparent 1px),
        radial-gradient(circle, #0003 1px, #fff 1px);
    background-size: 10px 10px;
    background-position: 0 0, 5px 5px;
    opacity: 0.2;
}

    .news-content {
        margin: 1em;
    }
    .news-category {
        font-size: 0.8em;
        color: #0066cc;
        text-transform: uppercase;
        margin-bottom: 10px;
    }
    .news-title {
        font-size: 1.4em;
        margin: 0 0 10px 0;
        color: #333;
        text-align: left;
    }
    .news-title a {
        color: #333;
    }
    .news-description {
        font-size: 0.9em;
        color: #666;
        margin-bottom: 15px;
        line-height: 1.4;
        text-align: left;
    }
    .news-metadata {
        display: flex;
        justify-content: space-between;
        font-size: 0.8em;
        color: #888;
    }
    .news-metadata a {
        color: #333;
    }
</style>

```js
function formatNumber(num) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
}
```

```js
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

```

```js
let filteredMarkets = allMarkets.filter(d => d.Status ? d.Status === "active" | d.Status === null : true);
const searchMarkets = view(Inputs.search(filteredMarkets, {
    placeholder: `Search ${formatNumber(filteredMarkets.length)} prediction markets`,
    width: "90%",
    query: query
}));
```

<div class="search-results" style="color: green">
  ${shuffle(searchMarkets).slice(0, 21).map(market => htl.html`
    <div class="news-card">
        <div class="news-content">
            <h2 class="news-title">
                <a href="https://data.adj.news/explore/market?question=${market.Question.Title}">
                    ${market.Question.Title.length > 34 ? market.Question.Title.substring(0, 34) + "..." : market.Question.Title}
                </a>
            </h2>
            <p class="news-description">${Number(market.Probability).toFixed(2)}% Probability</p>
            <div class="news-metadata">
                <a class="news-author" href="${market.Question.URL}" target="_blank" rel="noopener noreferrer">${market.Platform}</a>
                ${market.Volume && market.Forecasts ? htl.html`<span class="news-date">${market.Volume.toFixed(2)} volume / ${market.Forecasts} Forecasters</span>` : ''}
            </div>
        </div>
    </div>
  `)}
</div>