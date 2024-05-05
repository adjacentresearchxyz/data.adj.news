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
    "News": d.node.title,
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
      link.download = `metaculus-${dateString}.csv`;
      link.click();
    }
  })
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarkets, {
      rows: 30, 
      sort: "Forecasts", 
      reverse: true,
      layout: "auto",
      format: {
        "ID": d => {
          const splitID = d.split('-');
          const baseURL = splitID[0] === 'goodjudgmentopen' ? 'https://www.gjopen.com/questions/' : 'https://www.metaculus.com/questions/';
          return htl.html`<a href="${baseURL}${splitID[1]}" target="_blank">${d}</a>`;
        },
        "Title": d => d.substring(0, 50) + "...",
        "Forecasts": sparkbar(d3.max(searchMarkets, d => d.numForecasts)),
        "News": d => htl.html`<div style="display: flex; justify-content: center; align-items: center;">
          <a href="/feed/news?market=${d}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-external-link">
              <path d="M15 3h6v6"/>
              <path d="M10 14 21 3"/>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            </svg>
          </a>
        </div>`,
        "Date": d => d.substring(0, 10),
      }
    })}
  </div>
</div>