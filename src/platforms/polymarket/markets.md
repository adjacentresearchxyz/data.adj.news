```js
//
// Load data snapshots
//

// Polymarket Markets 
const polymarketMarkets = FileAttachment("../../data/polymarket/polymarket-markets.json").json();
```

```js
const polymarketMarketsClean = polymarketMarkets.data
  .map((d) => ({
    "Date": new Date().toLocaleDateString(),
    "ID": d.market_slug,
    "Title": d.question,
    "Description": d.description,
    "Yes": d.tokens[0].price,
    "No": d.tokens[1].price,
    "Active": d.active,
    "Closed": d.closed,
    "Archived": d.archived,
    "Platform": "Polymarket",
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

## Markets
<h3>Last reported at <code>${new Date().toLocaleDateString()}</code></h3>

```js
const searchMarkets = view(Inputs.search(polymarketMarketsClean, {placeholder: "Search markets…"}));
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarkets, {
      rows: 30, 
      sort: "Forecasts", 
      reverse: true,
      layout: "auto",
      format: {
        "Title": d => d.substring(0, 50) + "...",
        "Description": d => d.substring(0, 50) + "...",
        "ID": d => htl.html`<a href="https://polymarket.com/event/${d}" target="_blank">${d.substring(0,15) + "..."}</a>`,
      }
    })}
  </div>
</div>