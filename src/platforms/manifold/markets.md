```js
//
// Load data snapshots
//

// Manifold Markets 
const manifoldMarkets = FileAttachment("../../data/manifold/manifold-markets.json").json();
```

```js
// "id": "jihgS8KtykBqqIcuZBAG",
//     "creatorId": "hDq0cvn68jbAUVd6aWIU9aSv9ZA2",
//     "creatorUsername": "strutheo",
//     "creatorName": "chris (strutheo)",
//     "createdTime": 1714858379075,
//     "creatorAvatarUrl": "https://firebasestorage.googleapis.com/v0/b/mantic-markets.appspot.com/o/user-images%2Fstrutheo%2FkMuR3ttqcY.png?alt=media&token=a90c9db0-678b-42d7-9a8a-874f55f21b3d",
//     "closeTime": 1782964740000,
//     "question": "Will Kevin Durant be a Phoenix Suns player on July 1st 2026?",
//     "slug": "will-kevin-durant-be-a-phoenix-suns",
//     "url": "https://manifold.markets/strutheo/will-kevin-durant-be-a-phoenix-suns",
//     "pool": {
//       "NO": 100,
//       "YES": 100
//     },
//     "probability": 0.5,
//     "p": 0.5,
//     "totalLiquidity": 100,
//     "outcomeType": "BINARY",
//     "mechanism": "cpmm-1",
//     "volume": 0,
//     "volume24Hours": 0,
//     "isResolved": false,
//     "uniqueBettorCount": 0,
//     "lastUpdatedTime": 1714858379371
const manifoldMarketsClean = manifoldMarkets
  .filter(d => d.volume > 0) // Filter out markets with no volume
  .filter(d => d.probability > 0) // Filter out markets with no probability
  .map((d) => ({
    "Slug": {
        "slug": d.slug,
        "url": d.url,
    },
    "Question": d.question,
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
        "Volume": sparkbar(d3.max(searchMarkets, d => d.volume))
      }
    })}
  </div>
</div>