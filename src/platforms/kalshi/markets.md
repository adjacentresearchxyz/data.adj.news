```js
//
// Load data snapshots
//

// Kalshi Markets 
const kalshiMarkets = FileAttachment("../../data/kalshi/kalshi-markets.json").json();

// Kalshi Trades 
const kalshiTrades = FileAttachment("../../data/kalshi/kalshi-trades.json").json();
```

```js
const kalshiMarketsCleanActive = kalshiMarkets
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

const kalshiMarketsCleanFinalized = kalshiMarkets
  .filter(d => d.status === 'finalized')
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

## Active Markets
<h3>Last reported at <code>${kalshiMarketsCleanActive[0].Date}</code></h3>

```js
const searchMarketsActive = view(Inputs.search(kalshiMarketsCleanActive, {placeholder: "Search markets…"}));
```

```js
  Inputs.button("Download CSV", {
    value: null,
    reduce: () => {
      // Convert searchMarkets to CSV
      const csv = searchMarketsActive.map(row => Object.values(row).join(',')).join('\n');

      // Create a Blob with the CSV data
      const blob = new Blob([csv], {type: 'text/csv'});

      // Create a download link and click it
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      link.download = `kalshi-active-markets-${dateString}.csv`;
      link.click();
    }
  })
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarketsActive, {
      rows: 30, 
      sort: "Daily Volume", 
      reverse: true,
      layout: "auto",
      columns: ["Date", "Ticker", "Report Ticker", "Open Interest", "Daily Volume", "Block Volume", "High", "Low", "Platform"],
      header: {
        "Report Ticker": "Series"
      },
      format: {
        "Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}?referral=39c1bef1-c544-4b49-ab85-d336be5dc41c" target="_blank">${d}</a>`,
        "Report Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}?referral=39c1bef1-c544-4b49-ab85-d336be5dc41c" target="_blank">${d}</a>`,
        "Open Interest": sparkbar(d3.max(searchMarketsActive, d => d.open_interest)),
        "Daily Volume": sparkbar(d3.max(searchMarketsActive, d => d.daily_volume)),
        "Block Volume": sparkbar(d3.max(searchMarketsActive, d => d.block_volume)),
      }
    })}
  </div>
</div>

## Finalized Markets
<h3>Last reported at <code>${kalshiMarketsCleanFinalized[0].Date}</code></h3>

```js
const searchMarketsFinalized = view(Inputs.search(kalshiMarketsCleanFinalized, {placeholder: "Search markets…"}));
```

```js
  Inputs.button("Download CSV", {
    value: null,
    reduce: () => {
      // Convert searchMarkets to CSV
      const csv = searchMarketsFinalized.map(row => Object.values(row).join(',')).join('\n');

      // Create a Blob with the CSV data
      const blob = new Blob([csv], {type: 'text/csv'});

      // Create a download link and click it
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      link.download = `kalshi-active-markets-${dateString}.csv`;
      link.click();
    }
  })
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarketsFinalized, {
      rows: 30, 
      sort: "Daily Volume", 
      reverse: true,
      layout: "auto",
      columns: ["Date", "Ticker", "Report Ticker", "Open Interest", "Daily Volume", "Block Volume", "High", "Low", "Platform"],
      header: {
        "Report Ticker": "Series"
      },
      format: {
        "Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}?referral=39c1bef1-c544-4b49-ab85-d336be5dc41c" target="_blank">${d}</a>`,
        "Report Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}?referral=39c1bef1-c544-4b49-ab85-d336be5dc41c" target="_blank">${d}</a>`,
        "Open Interest": sparkbar(d3.max(searchMarketsFinalized, d => d.open_interest)),
        "Daily Volume": sparkbar(d3.max(searchMarketsFinalized, d => d.daily_volume)),
        "Block Volume": sparkbar(d3.max(searchMarketsFinalized, d => d.block_volume)),
      }
    })}
  </div>
</div>