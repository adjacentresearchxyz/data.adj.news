# [adj.news](https://adj.news) 

```js
//
// Load data snapshots
//

// Kalshi Markets 
const kalshiMarkets = FileAttachment("data/kalshi-markets.json").json();

// Kalshi Trades 
const kalshiTrades = FileAttachment("data/kalshi-trades.json").json();
```

```js
const kalshiMarketsClean = kalshiMarkets
  .filter(d => d.status === 'active')
  .map((d) => ({
    "Date": d.date,
    "Ticker": d.ticker_name,
    "Report Ticker": d.report_ticker,
    "Payout Type": d.payout_type,
    "Open Interest": d.open_interest,
    "Daily Volume": d.daily_volume,
    "Block Volume": d.block_volume,
    "High": d.high,
    "Low": d.low,
    "Status": d.status,
    "Platform": "Kalshi",
  }));
```

```js
const kalshiTradesClean = kalshiTrades.trades
  .map((d) => ({
    "Timestamp": d.create_date,
    "Trade ID": d.trade_id,
    "Market ID": d.market_id,
    "Ticker": d.ticker,
    "Price": d.price,
    "Count": d.count,
    "Taker Side": d.taker_side,
  }));
```

```js
function sparkbar(max) {
  return (x) => htl.html`<div style="
    background: var(--theme-blue);
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
// Date/time format/parse
const timeParse = d3.utcParse("%Y-%m-%dT%H");
const hourFormat = d3.timeFormat("%-I %p");
```

We are aggregating data from various markets and exchanges to provide a comprehensive view of the current state of *things*. <br/>Any feedback? Send mail at <code>[nate@adjacentresearch.xyz](mailto:nate@adjacentresearch.xyz)</code> <br/> Data is updated hourly. Current data is for <code>${kalshiMarkets[0].date}</code>

## Stats

<div class="grid grid-cols-4">
  <div class="card" style="color: inherit;">
    <h2>Active Markets</h2>
    <span class="big">${kalshiMarkets.filter(d => d.status === 'active').length}</span>
  </div>
  <div class="card" style="color: inherit;">
    <h2>Open Interest</h2>
    <span class="big">$${kalshiMarkets.filter(d => d.status === 'active').reduce((sum, market) => sum + market.open_interest, 0).toLocaleString()}</span>
  </div>
  <div class="card" style="color: inherit;">
    <h2>Daily Volume</h2>
    <span class="big">$${kalshiMarkets.filter(d => d.status === 'active').reduce((sum, market) => sum + market.daily_volume, 0).toLocaleString()}</span>
  </div>
</div>

## Active Markets

```js
const searchMarkets = view(Inputs.search(kalshiMarketsClean, {placeholder: "Search markets…"}));
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarkets, {
      rows: 30, 
      sort: "Daily Volume", 
      reverse: true,
      layout: "auto",
      columns: ["Date", "Ticker", "Report Ticker", "Open Interest", "Daily Volume", "Block Volume", "High", "Low", "Platform"],
      header: {
        "Report Ticker": "Series"
      },
      format: {
        "Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}" target="_blank">${d}</a>`,
        "Report Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}" target="_blank">${d}</a>`,
        "Open Interest": sparkbar(d3.max(searchMarkets, d => d.open_interest)),
        "Daily Volume": sparkbar(d3.max(searchMarkets, d => d.daily_volume)),
        "Block Volume": sparkbar(d3.max(searchMarkets, d => d.block_volume)),
      }
    })}
  </div>
</div>

<h2>Reported Trades</h2>
<h3>Last reported trade at <code>${kalshiTradesClean[0].Timestamp}</code></h3>

```js
const searchTrades = view(Inputs.search(kalshiTradesClean, {placeholder: "Search trades…"}));
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(kalshiTradesClean, {
      rows: 30, 
      sort: "Count", 
      reverse: true,
      layout: "auto",
      columns: ["Timestamp", "Trade ID", "Market ID", "Ticker", "Price", "Count", "Taker Side"],
      format: {
        "Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}" target="_blank">${d}</a>`,
        "Trade ID": d => d.length > 10 ? `${d.substring(0, 10)}...` : d,
        "Market ID": d => d.length > 10 ? `${d.substring(0, 10)}...` : d,
        "Count": sparkbar(d3.max(searchTrades, d => d.count)),
      }
    })}
  </div>
</div>