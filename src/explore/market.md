```js
// get ticker from url
const urlParams = new URLSearchParams(window.location.search);
const ticker = urlParams.get('ticker');

// load parquet files
const db = DuckDBClient.of({
  markets: FileAttachment("../data/api/markets.parquet"),
  trades: FileAttachment("../data/api/trades.parquet")
});
```

```js
// filter markets and trades down
let filteredTrades = await db.query(`SELECT adj_ticker, midpoint, reported_date FROM trades WHERE adj_ticker = '${ticker}'`)
let [filteredTradesCount] = await db.query(`SELECT COUNT(adj_ticker) as count FROM trades WHERE adj_ticker = '${ticker}'`)

// get daily markets
let [filteredMarket] = await db.query(`SELECT ticker, adj_ticker, question, description, platform FROM markets WHERE adj_ticker = '${ticker}'`)
let [filteredMarketCount] = await db.query(`SELECT COUNT(adj_ticker) as count FROM markets WHERE adj_ticker = '${ticker}'`)

// redirect if no market or no trades
if (filteredTradesCount.count < 1 || filteredMarketCount.count < 1) {
   window.location.href = '/';
}
```

```js
let relatedNews = fetch('https://api.data.adj.news/api/news/market/' + filteredMarket.question)
  .then(response => response.json())
  .then(data => {
    return data;
  })
  .catch(err => console.error(err));

let exaNews = fetch(`https://api.data.adj.news/api/news/${filteredMarket.question}`)
  .then(response => response.json())
  .then(data => {
    const transformedNews = data.results.map(news => ({
      id: news.id,
      feed_id: null,
      url: news.url,
      title: news.title,
      created_at: news.publishedDate,
      updated_at: news.publishedDate, 
      feed_title: 'Exa' 
    })).filter(news => news.id && news.url && news.title && news.created_at && news.updated_at && news.feed_title);
    return transformedNews.slice(0,4)
  })
  .catch(err => console.error('Error fetching related news:', err));

// let relatedMarkets = fetch('https://api.data.adj.news/api/markets/related/' + filteredMarket.question + '?threshold=0.85')
//   .then(response => response.json())
//   .then(data => {
//     return data;
//   })
//   .catch(err => console.error(err));
```

```js
const color = Plot.scale({color: {domain: ["Probability", "Volatility"]}});
const colorLegend = (y) => html`<span style="border-bottom: solid 2px ${color.apply(`${y}Y FRM`)};">${y}-year fixed-probability</span>`;
```

```js
const [probabilityData] = await db.query(`
  SELECT 
    MAX(midpoint) AS highest_probability,
    MIN(midpoint) AS lowest_probability
  FROM trades
  WHERE adj_ticker = '${ticker}'
`);

// first trade date
const [firstDate] = await db.query(`SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
  ORDER BY reported_date ASC
  LIMIT 1`
)

// latest trade date
const [latestDate] = await db.query(`SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
  ORDER BY reported_date DESC
  LIMIT 1`
)

// 10% into the rows for initial table load
const [tenthPercentRow] = await db.query(`
  SELECT * FROM (
    SELECT *,
           ROW_NUMBER() OVER (ORDER BY reported_date DESC) AS row_num,
           COUNT(*) OVER () AS total_rows
    FROM trades
    WHERE adj_ticker = '${ticker}'
  ) subquery
  WHERE row_num = CEIL(total_rows * 0.1)
`);

// 1 day ago
const oneDayAgo = Math.floor(Date.now() / 1000) - (1 * 24 * 60 * 60);
const oneDayAgoDate = new Date(oneDayAgo * 1000);
const nextDayAgoDate = new Date(oneDayAgo * 1000 + 24 * 60 * 60 * 1000);
const [rowOneDayAgo] = await db.query(`
  SELECT midpoint
  FROM trades
  WHERE adj_ticker = '${ticker}'
    AND reported_date >= '${oneDayAgoDate.toISOString().split('T')[0]}'
    AND reported_date < '${nextDayAgoDate.toISOString().split('T')[0]}'
  ORDER BY reported_date DESC
  LIMIT 1
`);

// 1wk ago 
const sevenDaysAgo = new Date(Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60));
const nextSevenDaysAgoDate = new Date(sevenDaysAgo * 1000 + 24 * 60 * 60 * 1000);
const [rowSevenDaysAgo] = await db.query(`
  SELECT midpoint
  FROM trades
  WHERE adj_ticker = '${ticker}'
    AND reported_date >= '${sevenDaysAgo.toISOString().split('T')[0]}'
    AND reported_date < '${nextSevenDaysAgoDate.toISOString().split('T')[0]}'
  ORDER BY reported_date DESC
  LIMIT 1
`);

// 10 days ago
const tenDaysAgo = new Date(Math.floor(Date.now()) - (10 * 24 * 60 * 60 * 1000))
const [rowTenDaysAgoAvg] = await db.query(`
  SELECT AVG(midpoint) AS ten_day_average
  FROM (
    SELECT midpoint
    FROM trades
    WHERE adj_ticker = '${ticker}'
      AND reported_date >= '${tenDaysAgo.toISOString().split('T')[0]}'
    ORDER BY reported_date DESC
  ) subquery
`);

// 1mo ago
const thirtyDaysAgo = new Date(Math.floor(Date.now()) - (30 * 24 * 60 * 60 * 1000))
const [rowThirtyDaysAgoAvg] = await db.query(`
  SELECT AVG(midpoint) AS thirty_day_average
  FROM (
    SELECT midpoint
    FROM trades
    WHERE adj_ticker = '${ticker}'
      AND reported_date >= '${thirtyDaysAgo.toISOString().split('T')[0]}'
    ORDER BY reported_date DESC
  ) subquery
`);

// 1yr ago
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
const oneYearAgoUnix = Math.floor(oneYearAgo.getTime() / 1000);
const oneYearAgoDate = new Date(oneYearAgoUnix * 1000);
const nextOneYearAgoDate = new Date(oneYearAgoUnix * 1000 + 24 * 60 * 60 * 1000);
const [rowOneYearAgo] = await db.query(`
  SELECT midpoint
  FROM trades
  WHERE adj_ticker = '${ticker}'
    AND reported_date >= '${oneYearAgoDate.toISOString().split('T')[0]}'
    AND reported_date < '${nextOneYearAgoDate.toISOString().split('T')[0]}'
  ORDER BY reported_date DESC
  LIMIT 1
`);

const defaultStartEnd = [
  new Date(tenthPercentRow.reported_date),
  new Date(latestDate.reported_date),
];

const startEnd = Mutable(defaultStartEnd);
const setStartEnd = (se) => startEnd.value = (se ?? defaultStartEnd);
const getStartEnd = () => startEnd.value;
```

```js
const minDate = new Date(firstDate.reported_date);
const maxDate = new Date(latestDate.reported_date);
```

```js
function frmCard(y, market) {
  const key = `probability`;

  const oneDayInSeconds = 24 * 60 * 60;
  const oneWeekInSeconds = 7 * oneDayInSeconds;
  const oneMonthInSeconds = 30 * oneDayInSeconds;
  const oneYearInSeconds = 365 * oneDayInSeconds;

  const todayUnix = latestDate.reported_date;
  const today = new Date(latestDate.reported_date);
  const yesterday = todayUnix - oneDayInSeconds;
  const oneWeekAgo = todayUnix - oneWeekInSeconds;
  const oneMonthAgo = todayUnix - oneMonthInSeconds;
  const yearAgo = todayUnix - oneYearInSeconds;

  const oneWeekChange = latestDate.midpoint - (rowSevenDaysAgo ? rowSevenDaysAgo.midpoint : 0);
  
  const diff1 = latestDate.midpoint - (rowOneDayAgo ? rowOneDayAgo.midpoint : 0);
  const diffY = latestDate.midpoint - (rowOneYearAgo ? rowOneYearAgo.midpoint : 0);

  // const avgVolatility = d3.mean(filteredTrades, (d) => d.daily_volatility);

  const stroke = color.apply(`Probability`);

  return html.fragment`
    <h1>${formatPercent(latestDate.midpoint)}</h1>
    <table>
      <tr>
        <td>1-day change</td>
        <td align="right">${formatPercent(diff1, {signDisplay: "always"})}</td>
        <td>${trend(diff1)}</td>
      </tr>
      <tr>
        <td>1-week change</td>
        <td align="right">${formatPercent(oneWeekChange, {signDisplay: "always"})}</td>
        <td>${trend(oneWeekChange)}</td>
      </tr>
      <tr>
        <td>10-day average</td>
        <td align="right">${formatPercent(rowTenDaysAgoAvg.ten_day_average)}</td>
      </tr>
      <tr>
        <td>1-month average</td>
        <td align="right">${formatPercent(rowThirtyDaysAgoAvg.thirty_day_average)}</td>
      </tr>
    </table>
    ${resize((width) =>
      Plot.plot({
        width,
        height: 40,
        axis: null,
        x: {inset: 40},
        marks: [
          Plot.tickX(filteredTrades, {
            x: key,
            stroke,
            insetTop: 10,
            insetBottom: 10,
            title: (d) => `${new Date(d.reported_date)?.toLocaleDateString("en-us")}: ${d.midpoint}%`,
            tip: {anchor: "bottom"}
          }),
          Plot.tickX(latestDate, {x: key, strokeWidth: 1}),
          Plot.text([`${formatPercent(probabilityData.lowest_probability, {signDisplay: "never"})}`], {frameAnchor: "left"}),
          Plot.text([`${formatPercent(probabilityData.highest_probability, {signDisplay: "never"})}`], {frameAnchor: "right"})
        ]
      })
    )}
  `;
}

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

```js
const latestTradesArray = filteredTrades.toString().match(/{[^}]+}/g);

// Parse each JSON string and create the desired object structure
const latestTradesParsedArray = latestTradesArray.map(jsonStr => {
  const obj = JSON.parse(jsonStr);
  return {
    reported_date: obj.reported_date,
    midpoint: obj.midpoint
  };
});
```

<style type="text/css">

/* @keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
} */

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
  <h1>${filteredMarket.question}</h1>
  <code>${filteredMarket.ticker} via ${filteredMarket.platform.charAt(0).toUpperCase() + filteredMarket.platform.slice(1)}</code>
  <details open>
    <summary>Read Full Rules</summary>
    <p>${filteredMarket.description}</p>
  </details>
<div>

<div style="display: flex; gap: 10px;">
  <div>${Inputs.button([
    ["Trade", () => {
      if (filteredMarket.platform === 'polymarket') {
        window.open(`https://polymarket.com/markets?_q=${filteredMarket.question}`, '_blank');
      } else if (filteredMarket.platform === 'kalshi') {
        window.open(`https://kalshi.com/events/${filteredMarket.adj_ticker.replace('adj-', '')}`, '_blank');
      } else {
        window.open(filteredMarket.link, '_blank');
      }
    }],
    ["Download", () => {
      const json = JSON.stringify(filteredTrades, (key, value) => typeof value === 'bigint' ? value.toString() : value);
      const blob = new Blob([json]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      link.download = `${filteredMarket.adj_ticker}-trades-${dateString}.json`;
      link.click();
    }],
    ["API", () => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.padding = '20px';
      modal.style.borderRadius = '5px';
      modal.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      modal.style.zIndex = '1000';
      modal.style.backgroundColor = 'rgba(0, 0, 0)';
      modal.innerHTML = `
        <button style="position: absolute; top: 10px; right: 10px; cursor: pointer;" onclick="document.body.removeChild(this.parentElement)">X</button>
        <a href="https://docs.adj.news" style="color: white; text-decoration: underline;"><h2 style="color: white;">Adjacent News API</h2></a>
        <h3>Related News</h3>
        <div>
          <pre style="white-space: pre-wrap; word-wrap: break-all; color: white;">curl --request GET 'https://api.data.adj.news/api/news/${filteredMarket.question.replace(/ /g, '%20')}'</pre>
          <button onclick="navigator.clipboard.writeText(document.querySelector('pre').innerText)" style="cursor: pointer;">Copy</button>
        </div><br />
        <h3>Related Markets</h3>
        <div>
          <pre style="white-space: pre-wrap; word-wrap: break-all; color: white;">curl --request GET 'https://api.data.adj.news/api/markets/related/${filteredMarket.question.replace(/ /g, '%20')}'</pre>
          <button onclick="navigator.clipboard.writeText(document.querySelector('pre').innerText)" style="cursor: pointer;">Copy</button>
        </div>
      `;
      document.body.appendChild(modal);
      document.addEventListener('click', function(e) {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    }, {value: null}]])}</div>
</div>

<div class="grid grid-cols-2-3" style="margin-top: 2rem;">
  <div class="card">${frmCard('Probability', filteredTrades)}</div>
  <div class="card">
    ${htl.html`
      <h2>Related News</h2>
      <table>
        ${Array.isArray(relatedNews) && relatedNews.length > 1 ? relatedNews.map(news => htl.html`
          <tr>
            <td style="padding-top: 15px;">
              <a href="${news.url}" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;">
                <h3>${news.title} - via ${news.feed_title}</h3>
              </a>
            </td>
          </tr>
        `) : Array.isArray(exaNews) && exaNews.length > 1 ? exaNews.map(news => htl.html`
          <tr>
            <td style="padding-top: 15px;">
              <a href="${news.url}" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;">
                <h3>${news.title} - via ${news.feed_title}</h3>
              </a>
            </td>
          </tr>
        `) : htl.html`<a href="https://adj.news">Read more at adj.news</a>`}
      </table>
    `}
  </div>
  <div class="card grid-colspan-2 grid-rowspan-2" style="display: flex; flex-direction: column;">
    <h2>Probability ${startEnd.map((d) => d.toLocaleDateString("en-US")).join("–")}</h2><br>
    <span style="flex-grow: 1;">${resize((width, height) =>
      Plot.plot({
        width,
        height,
        y: {grid: true, label: "Probability (%)"},
        x: {
          ticks: 10,
          label: "Date",
        },
        color,
        marks: [
          Plot.lineY(latestTradesParsedArray.filter((d) => new Date(startEnd[0]) <= new Date(d.reported_date) && new Date(d.reported_date) < new Date(startEnd[1])), {
            x: d => new Date(d.reported_date),
            y: "midpoint",
            tip: true
          }),
        ]
      })
    )}</span>
  </div>
</div>

<div class="grid">
  <div class="card">
    <h2>All Time Probability</h2><br />
    <!-- <h3>Click or drag to zoom</h3><br> -->
    ${resize((width) =>
      Plot.plot({
        type: "utc",
        width,
        y: {grid: true, label: "Probability (%)"},
        color,
        marks: [
          Plot.lineY(filteredTrades, {
            x: d => new Date(d.reported_date),
            y: "midpoint", 
            tip: true
          }),
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
</div>