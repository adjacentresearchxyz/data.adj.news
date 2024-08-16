---
title: Title
variable: Variable
---

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
let filteredTrades = await db.query(`SELECT * FROM trades WHERE adj_ticker = '${ticker}'`)
let [filteredTradesCount] = await db.query(`SELECT COUNT(*) as count FROM trades WHERE adj_ticker = '${ticker}'`)

// get daily markets

let [filteredMarket] = await db.query(`SELECT * FROM markets WHERE adj_ticker = '${ticker}'`)
let [filteredMarketCount] = await db.query(`SELECT COUNT(*) as count FROM markets WHERE adj_ticker = '${ticker}'`)

// redirect if no market or no trades
if (filteredTradesCount.count < 1 || filteredMarketCount.count < 1) {
   window.location.href = '/';
}
```

```js
let relatedNews = fetch('https://api.data.adj.news/api/news/market/' + filteredMarket.adj_ticker)
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

let relatedMarkets = fetch('https://api.data.adj.news/api/markets/related/' + filteredMarket.adj_ticker + '?threshold=0.85')
  .then(response => response.json())
  .then(data => {
    return data;
  })
  .catch(err => console.error(err));
```

```js
const color = Plot.scale({color: {domain: ["Probability", "Volatility"]}});
const colorLegend = (y) => html`<span style="border-bottom: solid 2px ${color.apply(`${y}Y FRM`)};">${y}-year fixed-probability</span>`;
```

```js
const [probabilityData] = await db.query(`
  SELECT 
    MAX(probability) AS highest_probability,
    MIN(probability) AS lowest_probability
  FROM trades
  WHERE adj_ticker = '${ticker}'
`);

// first trade date
const [firstDate] = await db.query(`SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
  ORDER BY timestamp ASC
  LIMIT 1`
)

// latest trade date
const [latestDate] = await db.query(`SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
  ORDER BY timestamp DESC
  LIMIT 1`
)

// 10% into the rows for initial table load
const [tenthPercentRow] = await db.query(`
  SELECT * FROM (
    SELECT *,
           ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS row_num,
           COUNT(*) OVER () AS total_rows
    FROM trades
    WHERE adj_ticker = '${ticker}'
  ) subquery
  WHERE row_num = CEIL(total_rows * 0.1)
`);

// 1 day ago
const oneDayAgo = Math.floor(Date.now() / 1000) - (1 * 24 * 60 * 60);
const [rowOneDayAgo] = await db.query(`
  SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
    AND timestamp >= ${oneDayAgo}
    AND timestamp < ${oneDayAgo + 24 * 60 * 60}
  ORDER BY timestamp DESC
  LIMIT 1
`);

// 1wk ago 
const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
const [rowSevenDaysAgo] = await db.query(`
  SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
    AND timestamp >= ${sevenDaysAgo}
    AND timestamp < ${sevenDaysAgo + 24 * 60 * 60}
  ORDER BY timestamp DESC
  LIMIT 1
`);
const latestTrades = await db.query(`
 SELECT * FROM (
    SELECT *,
           ROW_NUMBER() OVER (ORDER BY timestamp DESC) AS row_num,
           COUNT(*) OVER () AS total_rows
    FROM trades
    WHERE adj_ticker = 'ADJ-POLYMARKET-WILL-DONALD-TRUMP-WIN-THE-2024-US-PRESIDENTIAL-ELECTION'
  ) subquery
  WHERE row_num < CEIL(total_rows * 0.1)
`);

// 10 days ago
const tenDaysAgo = Math.floor(Date.now() / 1000) - (10 * 24 * 60 * 60);
const [rowTenDaysAgoAvg] = await db.query(`
  SELECT AVG(probability) AS ten_day_average
  FROM (
    SELECT probability
    FROM trades
    WHERE adj_ticker = '${ticker}'
      AND timestamp >= ${tenDaysAgo}
    ORDER BY timestamp DESC
    LIMIT 1
  ) subquery
`);

// 1mo ago
const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
const [rowThirtyDaysAgoAvg] = await db.query(`
  SELECT AVG(probability) AS thirty_day_average
  FROM (
    SELECT probability
    FROM trades
    WHERE adj_ticker = '${ticker}'
      AND timestamp >= ${thirtyDaysAgo}
    ORDER BY timestamp DESC
    LIMIT 1
  ) subquery
`);

// 1yr ago
const oneYearAgo = Math.floor(Date.now() / 1000) - (365 * 24 * 60 * 60);
const [rowOneYearAgo] = await db.query(`
  SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
    AND timestamp >= ${oneYearAgo}
    AND timestamp < ${oneYearAgo + 24 * 60 * 60}
  ORDER BY timestamp DESC
  LIMIT 1
`);


const defaultStartEnd = [
  new Date(tenthPercentRow.timestamp * 1000),
  new Date(latestDate.timestamp * 1000),
];

const startEnd = Mutable(defaultStartEnd);
const setStartEnd = (se) => startEnd.value = (se ?? defaultStartEnd);
const getStartEnd = () => startEnd.value;
```

```js
const query = `
  SELECT *
  FROM trades
  WHERE adj_ticker = '${ticker}'
    AND timestamp >= EXTRACT(EPOCH FROM TIMESTAMP '${new Date(getStartEnd()[0]).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/,/, '')}')
    AND timestamp < EXTRACT(EPOCH FROM TIMESTAMP '${new Date(getStartEnd()[1]).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/,/, '')}')
  ORDER BY timestamp DESC
`
const dateFilteredTrades = await db.query(query);

const minDate = new Date(firstDate.timestamp * 1000);
const maxDate = new Date(latestDate.timestamp * 1000);
```

```js
function frmCard(y, market) {
  const key = `probability`;

  const oneDayInSeconds = 24 * 60 * 60;
  const oneWeekInSeconds = 7 * oneDayInSeconds;
  const oneMonthInSeconds = 30 * oneDayInSeconds;
  const oneYearInSeconds = 365 * oneDayInSeconds;

  const todayUnix = latestDate.timestamp;
  const today = new Date(latestDate.timestamp);
  const yesterday = todayUnix - oneDayInSeconds;
  const oneWeekAgo = todayUnix - oneWeekInSeconds;
  const oneMonthAgo = todayUnix - oneMonthInSeconds;
  const yearAgo = todayUnix - oneYearInSeconds;

  const oneWeekChange = latestDate.probability - (rowSevenDaysAgo ? rowSevenDaysAgo.probability : 0);
  
  const diff1 = latestDate.probability - (rowOneDayAgo ? rowOneDayAgo.probability : 0);
  const diffY = latestDate.probability - (rowOneYearAgo ? rowOneYearAgo.probability : 0);

  // const avgVolatility = d3.mean(filteredTrades, (d) => d.daily_volatility);

  const stroke = color.apply(`Probability`);

  return html.fragment`
    <h1>${formatPercent(latestDate.probability * 100)}</h1>
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
            title: (d) => `${new Date(d.timestamp * 1000)?.toLocaleDateString("en-us")}: ${d.probability}%`,
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
  <code>${filteredMarket.adj_ticker}</code>
  <details open>
    <summary>Read Full Rules</summary>
    <p>${filteredMarket.description}</p>
  </details>
<div>

<div style="display: flex; gap: 10px;">
  <div>${Inputs.button([
    ["Trade", () => {
      window.open(filteredMarket.link, '_blank');
    }],
    ["Download", () => {
      const json = filteredTrades
      const blob = new Blob([json]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      link.download = `${filteredMarket.adj_ticker}-trades-${dateString}.json`;
      link.click();
    }]
  ], {value: null})}</div>
</div>


<div class="grid grid-cols-2-3" style="margin-top: 2rem;">
  <div class="card">${frmCard('Probability', filteredTrades)}</div>
  <div class="card">
    ${htl.html`
      <h2>Related News</h2>
      <table>
        ${relatedNews ? relatedNews.map(news => htl.html`
          <tr>
            <td style="padding-top: 15px;">
              <a href="${news.url}" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;">
                <h3>${news.title} - via ${news.feed_title}</h3>
              </a>
            </td>
          </tr>
        `): ''}
        ${!relatedNews || relatedNews.length < 2 ? exaNews.map(news => htl.html`
          <td style="padding-top: 15px;">
            <a href="${news.url}" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;">
              <h3>${news.title} - via ${news.feed_title}</h3>
            </a>
          </td>
        `) : ''}
      </table>
    `}
  </div>
  <div class="card grid-colspan-2 grid-rowspan-2" style="display: flex; flex-direction: column;">
    <h2>Latest Probability</h2><br>
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
          Plot.lineY(latestTrades, {
            x: d => new Date(d.timestamp * 1000),
            y: "probability",
            tip: true
          }),
        ]
      })
    )}</span>
  </div>
</div>

<div class="grid">
  <div class="card">
    <h2>All Time Probability</h2>
    <h3>Click or drag to zoom</h3><br>
    ${resize((width) =>
      Plot.plot({
        type: "utc",
        width,
        y: {grid: true, label: "Probability (%)"},
        color,
        marks: [
          Plot.lineY(filteredTrades, {
            x: d => new Date(d.timestamp * 1000),
            y: "probability", 
            tip: true
          })
        ]
      })
    )}
  </div>
</div>

<div style="margin-top: 2rem;">
  ${relatedMarkets ? relatedMarkets.map(market => htl.html`
      <a href="/explore/market?ticker=${market.adj_ticker}" style="text-decoration: none; color: inherit;">
        <div class='card' style='padding-right: 1em'>
          <h2>${market.question}</h2>
          <h1>${market.probability}%</h1>
          <p>${market.description}</p>
          <table>
            <!-- <tr>
              <td>Probability</td>
              <td align="right">${formatPercent(market.probability, {signDisplay: "never"})}</td>
            </tr> -->
          </table>
        </div>
      </a>
    `) : ''}
  </div>
</div>