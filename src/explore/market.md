---
title: My favorite page
---

```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('question');
```

```js
  // clean up the market query parameter
  const allowedChars = /[^a-zA-Z0-9 ,.?!]/g;
  let market_filtered = market.replace(allowedChars, '');
  market_filtered = market_filtered.trim();

  // Fetch news data
  // const response = await fetch(`https://api.data.adj.news/api/news/${market_filtered}`);
  // // const response = await fetch(`https://localhost:8787/api/news/${market}`)
  // const data = await response.json();
  // const news = data.results;
```

```js
//
// Load data snapshots
//

// Kalshi Markets
const kalshiMarkets = FileAttachment("../data/kalshi/kalshi-markets.json").json();

// Metaculus Markets 
const metaculusMarkets = FileAttachment("../data/metaculus/metaculus-markets.json").json();

// Manifold Markets 
const manifoldMarketsZip = FileAttachment("../data/manifold/manifold-markets.zip").zip();
const manifoldMarkets = FileAttachment("../data/manifold/manifold-markets/markets.json").json();

// Polymarket Markets 
const polymarketMarkets = FileAttachment("../data/polymarket/polymarket-markets.json").json();
```

```js
// Iterate over markets for each platform and try and match the market to the news query to display odds
const allMarkets = [...metaculusMarkets, ...manifoldMarkets, ...polymarketMarkets, ...kalshiMarkets];
const fullMarket = allMarkets.find(platformMarket => platformMarket.Question.Title.toLowerCase().includes(market.toLowerCase()));
```


```js
const color = Plot.scale({color: {domain: ["30Y FRM", "15Y FRM"]}});
const colorLegend = (y) => html`<span style="border-bottom: solid 2px ${color.apply(`${y}Y FRM`)};">${y}-year fixed-rate</span>`;
```

<!-- ```js
const defaultStartEnd = [pmms.at(-53).date, pmms.at(-1).date];
const startEnd = Mutable(defaultStartEnd);
const setStartEnd = (se) => startEnd.value = (se ?? defaultStartEnd);
const getStartEnd = () => startEnd.value;
``` -->

```js
function frmCard(market) {
  // const key = `pmms${y}`;
  // const diff1 = pmms.at(-1)[key] - pmms.at(-2)[key];
  // const diffY = pmms.at(-1)[key] - pmms.at(-53)[key];
  // const range = d3.extent(pmms.slice(-52), (d) => d[key]);
  // const stroke = color.apply(`${y}Y FRM`);
  // <h2 style="color: ${market.Question.Title}</b></h2>

  return html.fragment`
    <h1>${formatPercent(market.Probability)}</h1>
  `;
}

// In the above code when historical data is there 
//     // <table>
//     //   <tr>
//     //     <td>1-week change</td>
//     //     <td align="right">${formatPercent(diff1, {signDisplay: "always"})}</td>
//     //     <td>${trend(diff1)}</td>
//     //   </tr>
//     //   <tr>
//     //     <td>1-year change</td>
//     //     <td align="right">${formatPercent(diffY, {signDisplay: "always"})}</td>
//     //     <td>${trend(diffY)}</td>
//     //   </tr>
//     //   <tr>
//     //     <td>4-week average</td>
//     //     <td align="right">${formatPercent(d3.mean(pmms.slice(-4), (d) => d[key]))}</td>
//     //   </tr>
//     //   <tr>
//     //     <td>52-week average</td>
//     //     <td align="right">${formatPercent(d3.mean(pmms.slice(-52), (d) => d[key]))}</td>
//     //   </tr>
//     // </table>
//     ${resize((width) =>
//       Plot.plot({
//         width,
//         height: 40,
//         axis: null,
//         x: {inset: 40},
//         marks: [
//           Plot.tickX(pmms.slice(-52), {
//             x: key,
//             stroke,
//             insetTop: 10,
//             insetBottom: 10,
//             title: (d) => `${d.date?.toLocaleDateString("en-us")}: ${d[key]}%`,
//             tip: {anchor: "bottom"}
//           }),
//           Plot.tickX(pmms.slice(-1), {x: key, strokeWidth: 2}),
//           Plot.text([`${range[0]}%`], {frameAnchor: "left"}),
//           Plot.text([`${range[1]}%`], {frameAnchor: "right"})
//         ]
//       })
//     )}
//     // <span class="small muted">52-week range</span>

function formatPercent(value, format) {
  return value == null
    ? "N/A"
    : (value / 100).toLocaleString("en-US", {minimumFractionDigits: 2, style: "percent", ...format});
}

function trend(v) {
  return v >= 0.005 ? html`<span class="green">↗︎</span>`
    : v <= -0.005 ? html`<span class="red">↘︎</span>`
    : "→";
}
```

<style>
  .card {
    width: 20%;
  }
  .news-item {
    /* width: 50%; */
    /* border: 1px dotted #d3d3d3; */
    /* border-radius: 7px; */
    padding: 0;
    margin: 0;
    margin-bottom: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    font-family: monospace, sans-serif;
    color: #fff;
  }
  .news-item a {
    color: #1b95e0;
    text-decoration: none;
  }
  .news-item a:hover {
    text-decoration: underline;
  }
  @container (min-width: 560px) {
    .grid-cols-2-3 {
      grid-template-columns: 1fr 1fr;
    }
    .grid-cols-2-3 .grid-colspan-2 {
      grid-column: span 2;
    }
  }

  @container (min-width: 840px) {
    .grid-cols-2-3 {
      grid-template-columns: 1fr 2fr;
      grid-auto-flow: column;
    }
  }
</style>

<div>
  ${
    fullMarket ? htl.html`
      <h1><a href="${fullMarket.Link}" class="dotted" target="_blank">${market}</a></h1>
      <div class="card">${fullMarket.Probability}% Probability</div>
      <div style="margin-top: 1rem;">
        <a href="${fullMarket.Link}" target="_blank" class="trade-now-button">Trade Now</a>
      </div>
    ` : ""
  }
  <!-- <h2>News</h2>
  Powered by <a href="https://exa.ai" target="_blank" class="dotted">Exa</a>
  <br />
  <div style="margin-left: -1em;">
    <ul>
      ${news.map(d => htl.html`
        <li class="news-item">
          <a href="${d.url}" target="_blank">${d.title}</a>
        </li>
      `)}
    </ul>
  </div> -->

<!-- <div class="grid grid-cols-2-3" style="margin-top: 2rem;"> -->
  <!-- <div class="card">${fullMarket.Probability}</div> -->
  <!-- <div class="card grid-colspan-2 grid-rowspan-2" style="display: flex; flex-direction: column;">
    <h2>Rates ${startEnd === defaultStartEnd ? "over the past year" : startEnd.map((d) => d.toLocaleDateString("en-US")).join("–")}</h2><br>
    <span style="flex-grow: 1;">${resize((width, height) =>
      Plot.plot({
        width,
        height,
        y: {grid: true, label: "rate (%)"},
        color,
        marks: [
          Plot.lineY(tidy.filter((d) => startEnd[0] <= d.date && d.date < startEnd[1]), {x: "date", y: "rate", stroke: "type", curve: "step", tip: true, markerEnd: true})
        ]
      })
    )}</span>
  </div> -->
<!-- </div> -->

<!-- <div class="grid">
  <div class="card">
    <h2>Rates over all time (${d3.extent(pmms, (d) => d.date.getUTCFullYear()).join("–")})</h2>
    <h3>Click or drag to zoom</h3><br>
    ${resize((width) =>
      Plot.plot({
        width,
        y: {grid: true, label: "rate (%)"},
        color,
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(tidy, {x: "date", y: "rate", stroke: "type", tip: true}),
          (index, scales, channels, dimensions, context) => {
            const x1 = dimensions.marginLeft;
            const y1 = 0;
            const x2 = dimensions.width - dimensions.marginRight;
            const y2 = dimensions.height;
            const brushed = (event) => {
              if (!event.sourceEvent) return;
              let {selection} = event;
              if (!selection) {
                const r = 10; // radius of point-based selection
                let [px] = d3.pointer(event, context.ownerSVGElement);
                px = Math.max(x1 + r, Math.min(x2 - r, px));
                selection = [px - r, px + r];
                g.call(brush.move, selection);
              }
              setStartEnd(selection.map(scales.x.invert));
            };
            const pointerdowned = (event) => {
              const pointerleave = new PointerEvent("pointerleave", {bubbles: true, pointerType: "mouse"});
              event.target.dispatchEvent(pointerleave);
            };
            const brush = d3.brushX().extent([[x1, y1], [x2, y2]]).on("brush end", brushed);
            const g = d3.create("svg:g").call(brush);
            g.call(brush.move, getStartEnd().map(scales.x));
            g.on("pointerdown", pointerdowned);
            return g.node();
          }
        ]
      })
    )}
  </div>
</div> -->
</div>