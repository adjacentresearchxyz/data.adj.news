```js
//
// Load data snapshots
//

// Rootclaim Markets 
const rootclaimMarkets = FileAttachment("../../data/rootclaim/rootclaim-markets.json").json();
```

```js
const rootclaimMarketsClean = rootclaimMarkets.result.main_page_stories
  .flatMap((d) => d.scenarios.map((scenario) => ({
    "Slug": {
        "url": `https://rootclaim.com/questions/${d.slug}`,
        "slug": d.slug
    },
    "Comments": d.comments_count,
    "Probability": scenario.net_prob,
    "Question": scenario.name || d.question,
    "Platform": "Rootclaim",
  })));
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
const searchMarkets = view(Inputs.search(rootclaimMarketsClean, {placeholder: "Search markets…"}));
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
      link.download = `rootclaim-${dateString}.csv`;
      link.click();
    }
  })
```

<div class="table-responsive">
  <div class="card" style="padding: 0;">
    ${Inputs.table(searchMarkets, {
      rows: 30, 
      sort: "Comments", 
      reverse: true,
      layout: "auto",
      columns: ["Slug", "Question", "Probability", "Comments", "Platform"],
      format: {
        "Question": d => {
            const cleanString = d.replace(/<[^>]*>/g, "").replace(/[^\x00-\x7F]/g, "").replace(/&nbsp;/g, " ");
            return /^[^!?.]*$/.test(cleanString.substring(0,50)) ? cleanString.substring(0,50) + "..." : cleanString;
        },
        "Slug": d => htl.html`<a href="https://rootclaim.com/analysis/${d.slug}" target="_blank">${d.slug}</a>`,
        "Probability": d => d.toFixed(2),
        "Comments": sparkbar(d3.max(searchMarkets, d => d.comments)),
      }
    })}
  </div>
</div>