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
const metaculusMarketsClean = metaculusMarkets.data.questions.edges
  .filter(d => d.node.options)
  .filter(d => d.node.options.length === 2) // binary markets
  .filter(d => d.node.options.every(o => o.probability !== null)) // all probabilities
  .filter(d => d.node.description) // description
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.node.id,
    "Open Interest": null,
    "Volume": null,
    "Probability": (d.node.options[0].probability * 100).toFixed(2),
    "Question": {
      "Title": d.node.title,
      "URL": d.node.url,
    },
    "Description": d.node.description,
    "Forecasts": d.node.qualityIndicators.numForecasts,
    "Link": d.node.url,
    "News": {
      "Question": d.node.title,
      "URL": d.node.url,
    },
    "Status": null, // @TODO This should be able to be pulled
    "Platform": "Metaculus",
  }));
```

```js
const manifoldMarketsClean = manifoldMarkets
  .filter(d => d.volume > 0) // Filter out markets with no volume
  .filter(d => d.probability > 0) // Filter out markets with no probability
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.slug,
    "Open Interest": null,
    "Volume": d.volume,
    "Probability": (d.probability * 100).toFixed(2),
    "Question": {
      "Title": d.question,
      "URL": d.url,
    },
    "Description": d.question,
    "Forecasts": d.uniqueBettorCount,
    "Link": d.url,
    "News": {
      "Question": d.question,
      "URL": d.url,
    },
    "Status": d.isResolved ? "finalized" : "active",
    "Platform": "Manifold",
  }));
```

```js
const polymarketMarketsClean = polymarketMarkets.data
  .filter(d => d.active) // Filter out inactive markets
  .filter(d => !d.archived) // Filter out archived markets
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": new Date(d.end_date_iso).toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "Market": d.market_slug,
    "Open Interest": null, // for $ markets, @TODO This should be able to be pulled 
    "Volume": null, // @TODO This should be able to be pulled 
    "Probability": d.tokens[0].price.toFixed(2) * 100,
    "Question": {
      "Title": d.question,
      "URL": "https://polymarket.com/market/" + d.market_slug,
    },
    "Description": d.description,
    "Forecasts": null, // for non $ markets
    "Link": "https://polymarket.com/market/" + d.market_slug,
    "News": {
      "Question": d.question,
      "URL": "https://polymarket.com/market/" + d.market_slug,
    }, // in order to render news we need question and url
    "Status": new Date(d.end_date_iso) < new Date() ? "finalized" : "active", // if end date is in the past, market is finalized
    "Platform": "Polymarket",
  }));
```

```js
const kalshiMarketsClean = kalshiMarkets
  .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.ticker_name,
    "Open Interest": d.open_interest,
    "Volume": d.daily_volume + d.block_volume,
    "Probability": ((d.high + d.low) / 2).toFixed(2), // avg. of high and low
    "Question": {
      "Title": d.ticker_name, // @TODO This should be able to be pulled
      "URL": "https://kalshi.com/markets/" + d.report_ticker,
    },
    "Description": d.report_ticker, // @TODO This should be able to be pulled
    "Forecasts": null,
    "Link": "https://kalshi.com/markets/" + d.report_ticker,
    "News": {
      "Question": d.report_ticker,
      "URL": "https://kalshi.com/markets/" + d.report_ticker,
    },
    "Status": d.status,
    "Platform": "Kalshi",
  }));
```

```js
// Aggregate all markets
const allMarkets = [...kalshiMarketsClean, ...polymarketMarketsClean, ...metaculusMarketsClean, ...manifoldMarketsClean];
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

```js
// Active Markets Toggle
const  marketStatus = view(Inputs.toggle({label: "Only Active Markets", value: true, description: "Toggle to show only active markets"}));

// Platform Filter
const marketPlatforms = allMarkets.map(d => d.Platform).filter((v, i, a) => a.indexOf(v) === i)
const platformFilter = view(Inputs.select(["All", ...marketPlatforms], {label: "Platforms", value: "All"}));
```

```js
// if marketStatus is true, filter out the finalized markets
let filteredMarkets = allMarkets.filter(d => marketStatus ? d.Status === "active" | d.Status === null : true);

// if platformFilter is not "All", filter out the markets that don't match the platform
filteredMarkets = filteredMarkets.filter(d => platformFilter === "All" ? true : d.Platform === platformFilter);

const searchMarkets = view(Inputs.search(filteredMarkets, {placeholder: "Search markets…"}));
```

```js
  Inputs.button("Download CSV", {
    value: null,
    reduce: () => {
      // Convert searchMarkets to CSV
      const csv = searchMarkets.map(row => Object.values(row).join(',')).join('\n');

      // Create a Blob with the CSV data
      const blob = new Blob([csv], {type: 'text/csv'});

      // Create a download link and click it
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      link.download = `markets-${dateString}.csv`;
      link.click();
    }
  })
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarkets, {
      rows: 35, 
      sort: "Volume", 
      reverse: true,
      layout: "auto",
      columns: ["News", "Question", "Probability", "Volume", "Open Interest", "Forecasts", "Platform", "Status"],
      width: {
        "Question": "25%",
      },
      format: {
        "Slug": d => htl.html`<a href="${d.url}" target="_blank">${d.slug.substring(0,25)}</a>`,
        "Question": d => htl.html`<a href="${d.URL}" target="_blank">${d.Title.substring(0,50)}</a>`,
        "Probability": d => d + "%",
        "Forecasts": sparkbar(d3.max(searchMarkets, d => d["Forecasts"])),
        "Volume": sparkbar(d3.max(searchMarkets, d => d.volume)),
        "Open Interest": sparkbar(d3.max(searchMarkets, d => d.open_interest)),
        "News": d => htl.html`<div style="display: flex; justify-content: center; align-items: center;">
          <a href="/feed/news?market=${d.Question}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link">
              <path d="M15 3h6v6"/>
              <path d="M10 14 21 3"/>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            </svg>
          </a>
        </div>`,
      }
    })}
  </div>
</div>