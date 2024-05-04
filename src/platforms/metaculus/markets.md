```js
//
// Load data snapshots
//

// Metaculus Markets 
const metaculusMarkets = FileAttachment("../../data/metaculus/metaculus-markets.json").json();
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
    // "Link": d.node.url,
    "Yes": d.node.options[0].probability,
    "No": d.node.options[1].probability,
    "Forecasts": d.node.qualityIndicators.numForecasts,
    "Stars": d.node.qualityIndicators.stars,
    "Platform": "Metaculus",
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
<h3>Last reported at <code>${metaculusMarketsClean[0].Date}</code></h3>

```js
const searchMarkets = view(Inputs.search(metaculusMarketsClean, {placeholder: "Search markets…"}));
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarkets, {
      rows: 30, 
      sort: "Forecasts", 
      reverse: true,
      layout: "auto",
      format: {
        "Report Ticker": d => htl.html`<a href="https://kalshi.com/markets/${d}?referral=39c1bef1-c544-4b49-ab85-d336be5dc41c" target="_blank">${d}</a>`,
        "Title": d => d.substring(0, 50) + "...",
        "Forecasts": sparkbar(d3.max(searchMarkets, d => d.numForecasts)),
      }
    })}
  </div>
</div>