```js
const db = DuckDBClient.of({markets: FileAttachment("./data/api/markets.parquet"), volatile: FileAttachment("./data/api/volatile.parquet")});
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
function sparkbar(max) {
  return (x) => htl.html`<div style="
    background: ${x > 50 ? 'var(--theme-green)' : 'var(--theme-red)'};
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en-US")}`
}
```

```js
let filteredMarkets = await db.query("SELECT * FROM volatile")
let [filteredMarketsCount] = await db.query("SELECT COUNT(*) as count from volatile")
const searchMarkets = view(Inputs.search(filteredMarkets, {
    placeholder: `Search ${formatNumber(filteredMarketsCount.count)} prediction markets`,
    width: "95%",
    query: query,
}));
```
<div>
${Inputs.table(searchMarkets.sort((a, b) => Math.abs(b.price_diff) - Math.abs(a.price_diff)), {
    rows: filteredMarketsCount.count,
    columns: ['ticker', 'question', 'description', 'platform', 'latest_price', 'price_diff'],
    header: {
        latest_price: 'Latest Price',
        price_diff: '15 min Change',
        ticker: 'Ticker',
        question: 'Question',
        description: 'Description',
        platform: 'Platform',
    },
    format: {
        latest_price: sparkbar(100),
        price_diff: sparkbar(100),
        ticker: (value, row) => {
            return htl.html`<a href="/explore/market?ticker=adj-${value}">${value}</a>`;
        },
        platform: (value, row) => {
            if (value === value.toUpperCase()) {
                return htl.html`<a href="https://kalshi.com/events/${value}" target="_blank">${value.length > 20 ? value.slice(0, 20) + '...' : value}</a>`;
            } else if (value === value.toLowerCase()) {
                return htl.html`<a href="https://polymarket.com/markets/?_q=${encodeURIComponent(value.replace(/-/g, ' '))}" target="_blank">${value.length > 20 ? value.slice(0, 20) + '...' : value}</a>`;
            } else {
                return value;
            }
        },
        question: (value) => value.length > 50 ? value.slice(0, 50) + '...' : value,
        description: (value) => value.length > 100 ? value.slice(0, 100) + '...' : value,
    },
    align: {
        probability: 'right',
    },
    maxHeight: '100%',
    layout: 'fixed',
    required: true,
    select: false,
    multiple: false,
    filter: (row) => row.status === 'active' || row.status === 'true',
})}
</div>