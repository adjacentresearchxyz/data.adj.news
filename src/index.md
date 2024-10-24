```js
const db = DuckDBClient.of({markets: FileAttachment("./data/api/markets.parquet")});
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
    color: #ffffff;
    text-transform: uppercase;
    margin-bottom: 10px;
}
.news-title {
    font-size: 1.4em;
    margin: 0 0 10px 0;
    color: #ffffff;
    text-align: left;
}
.news-title a {
    color: #ffffff;
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
    color: #000000;
}
.news-metadata a {
    color: #ffffff;
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
let filteredMarkets = await db.query("SELECT * FROM markets WHERE (status = 'active' or status = 'true') and probability < 99 and probability > 0")
let [filteredMarketsCount] = await db.query("SELECT COUNT(*) as count from markets WHERE (status = 'active' or status = 'true') and probability < 99 and probability > 0")
const searchMarkets = view(Inputs.search(filteredMarkets, {
    placeholder: `Search ${formatNumber(filteredMarketsCount.count)} prediction markets`,
    width: "95%",
    query: query,
}));
```

<div class="search-results" style="color: green">
  ${shuffle(searchMarkets).slice(0, 21).map(market => htl.html`
    <div class="card">
        <div class="news-content">
            <h2 class="news-title">
                <a href="/explore/market?ticker=${market.adj_ticker}">
                    ${market.question}
                </a>
            </h2>
            <p class="news-description">${market.category.replace(/[<>"]/g, '').split(',').map(cat => cat.trim()).filter(cat => cat !== 'All').join(', ')}</p>
            <!-- <p class="news-description">${Number(market.probability).toFixed(2)}% Probability</p> -->
            <div class="news-metadata">
                <a class="news-author" href="${market.platform === 'polymarket' ? `https://polymarket.com/markets?_q=${market.question}` : market.platform === 'kalshi' ? `https://kalshi.com/events/${market.adj_ticker.replace('adj-', '')}` : market.link}" target="_blank" rel="noopener noreferrer">${market.platform.charAt(0).toUpperCase() + market.platform.slice(1)}</a>
                ${market.volume && market.forecasts ? htl.html`<span class="news-date">${market.volume.toFixed(2)} volume / ${market.forecasts} Forecasters</span>` : ''}
            </div>
        </div>
    </div>
  `)}
</div>