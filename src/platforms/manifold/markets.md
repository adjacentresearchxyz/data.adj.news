```js
//
// Load data snapshots
//

// Manifold Markets 
const manifoldMarkets = FileAttachment("../../data/manifold/manifold-markets.json").json();
```

```js
const manifoldMarketsClean = manifoldMarkets
  .filter(d => d.volume > 0) // Filter out markets with no volume
  .filter(d => d.probability > 0) // Filter out markets with no probability
  .map((d) => ({
    "Slug": {
        "slug": d.slug,
        "url": d.url,
    },
    "Question": d.question,
    "News": {
      "question": d.question,
      "url": d.url,
    },
    "Probability": d.probability,
    "Unique Bettor Count": d.uniqueBettorCount,
    "Volume": d.volume,
    "Platform": "Manifold",
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
const searchMarkets = view(Inputs.search(manifoldMarketsClean, {placeholder: "Search markets…"}));
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
      link.download = `manifold-${dateString}.csv`;
      link.click();
    }
  })
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarkets, {
      rows: 30, 
      sort: "Volume", 
      reverse: true,
      layout: "auto",
      format: {
        "Slug": d => htl.html`<a href="${d.url}" target="_blank">${d.slug.substring(0,25)}</a>`,
        "Question": d => d.substring(0,50) + "...",
        "Unique Bettor Count": sparkbar(d3.max(searchMarkets, d => d["Unique Bettor Count"])),
        "Volume": sparkbar(d3.max(searchMarkets, d => d.volume)),
        "News": d => htl.html`<div style="display: flex; justify-content: center; align-items: center;">
          <a href="/feed/news?market=${d.question}">
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