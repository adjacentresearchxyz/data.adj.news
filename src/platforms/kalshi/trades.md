```js
//
// Load data snapshots
//

// Kalshi Trades 
const kalshiTrades = FileAttachment("../../data/kalshi/kalshi-trades.json").json();
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

## Reported Trades
<h3>Last reported trade at <code>${kalshiTradesClean[0].Timestamp}</code></h3>

```js
const searchTrades = view(Inputs.search(kalshiTradesClean, {placeholder: "Search trades…"}));
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(kalshiTradesClean, {
      rows: 30, 
      sort: "Timestamp", 
      reverse: true,
      layout: "auto",
      columns: ["Timestamp", "Trade ID", "Market ID", "Ticker", "Price", "Count", "Taker Side"],
      format: {
        "Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}?referral=39c1bef1-c544-4b49-ab85-d336be5dc41c" target="_blank">${d}</a>`,
        "Trade ID": d => d.length > 10 ? `${d.substring(0, 10)}...` : d,
        "Market ID": d => d.length > 10 ? `${d.substring(0, 10)}...` : d,
        "Count": sparkbar(d3.max(searchTrades, d => d.count)),
      }
    })}
  </div>
</div>