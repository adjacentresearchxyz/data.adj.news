# [adj.news](https://adj.news) 

```js
//
// Load data snapshots
//

// Kalshi Markets 
const kalshiMarkets = FileAttachment("data/kalshi-markets.json").json();
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
    "Status": d.status
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

We are aggregating data from various markets and exchanges to provide a comprehensive view of the current state of *things*. <br/>Any feedback? Send mail at <code>[nate@adjacentresearch.xyz](mailto:nate@adjacentresearch.xyz)</code>

<div class="grid grid-cols-4">
  <a class="card" href="https://github.com/observablehq/plot/releases" style="color: inherit;">
    <h2>Active Markets</h2>
    <span class="big">${kalshiMarkets.filter(d => d.status === 'active').length}</span>
  </a>
  <a class="card" href="https://github.com/observablehq/plot/releases" style="color: inherit;">
    <h2>Open Interest</h2>
    <span class="big">$${kalshiMarkets.filter(d => d.status === 'active').reduce((sum, market) => sum + market.open_interest, 0).toLocaleString()}</span>
  </a>
  <a class="card" href="https://github.com/observablehq/plot/releases" style="color: inherit;">
    <h2>Daily Volume</h2>
    <span class="big">$${kalshiMarkets.filter(d => d.status === 'active').reduce((sum, market) => sum + market.daily_volume, 0).toLocaleString()}</span>
  </a>
</div>

```js
const search = view(Inputs.search(kalshiMarketsClean, {placeholder: "Search markets…"}));
```

<div class="card" style="padding: 0;">
  ${Inputs.table(search, {
    rows: 40, 
    sort: "Daily Volume", 
    reverse: true,
    format: {
      "Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}" target="_blank">${d}</a>`,
      "Report Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}" target="_blank">${d}</a>`,
      "Open Interest": sparkbar(d3.max(search, d => d.open_interest)),
      "Daily Volume": sparkbar(d3.max(search, d => d.daily_volume)),
      "Block Volume": sparkbar(d3.max(search, d => d.block_volume)),
    }
  })}
</div>