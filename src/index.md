```js
//
// Load data snapshots
//

// Kalshi Markets 
const kalshiMarkets = FileAttachment("./data/kalshi/kalshi-markets.json").json();

// Metaculus Markets 
const metaculusMarkets = FileAttachment("./data/metaculus/metaculus-markets.json").json();

// Manifold Markets 
const manifoldMarkets = FileAttachment("./data/manifold/manifold-markets.json").json();

// Polymarket Markets 
const polymarketMarkets = FileAttachment("./data/polymarket/polymarket-markets.json").json();
```

```js
// Aggregate all markets
const allMarkets = [...kalshiMarkets, ...polymarketMarkets, ...metaculusMarkets, ...manifoldMarkets];
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
    // Get the header row from the keys of the first object in searchMarkets
    const header = Object.keys(searchMarkets[0]).join(',');

    // Change Question and News keys so they aren't objects 
    searchMarkets.forEach(d => {
      d.Question = d.Question.Title;
      d.News = "https://adj.news/feed/news?market=" + d.News.Question;
    });

    // Convert searchMarkets to CSV
    const csv = searchMarkets.map(row => Object.values(row).join(',')).join('\n');

    // Prepend the header row to the CSV data
    const csvWithHeader = `${header}\n${csv}`;

    // Create a Blob with the CSV data
    const blob = new Blob([csvWithHeader], {type: 'text/csv'});

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