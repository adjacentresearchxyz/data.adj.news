```js
const urlParams = new URLSearchParams(window.location.search);
const ticker = urlParams.get('ticker');

// csv for market and trade information
const markets = FileAttachment("../data/api/markets.csv").csv({typed: true});
const trades = FileAttachment("../data/api/trades.csv").csv({typed: true});

const filteredTrades = trades
  .then(rows => {
    // Filter rows based on adj_ticker
    const filteredRows = rows.filter(row => row['adj_ticker'] === ticker);
    
    // Ensure all timestamp values are unique
    const uniqueTimestamps = new Set();
    const uniqueRows = filteredRows.filter(row => {
      if (uniqueTimestamps.has(row['date'])) {
        return false;
      } else {
        uniqueTimestamps.add(row['date']);
        return true;
      }
    });

    return uniqueRows;
  });

// all data but cleaned
const tidy = filteredTrades.then((rows) => rows.flatMap(({date, probability, daily_volatility}) => [{date: date, probability: probability * 100, type: "Probability"}]));

// daily data for download and stats
const daily = filteredTrades.then((rows) => {
  const dailyData = rows.reduce((acc, {date, probability, daily_volatility}) => {
    const formattedDate = new Date(date).setHours(0, 0, 0, 0);
    const formattedDateString = new Date(formattedDate).toLocaleDateString('en-US');
    if (!acc[formattedDateString]) {
      acc[formattedDateString] = {date: formattedDateString, probability: 0, volatility: 0, count: 0};
    }
    acc[formattedDateString].probability += probability;
    acc[formattedDateString].volatility += daily_volatility;
    acc[formattedDateString].count++;
    return acc;
  }, {});
  return Object.values(dailyData).map(({date, probability, volatility, count}) => ({
    date: date,
    probability: Math.round((probability / count * 100) * 100) / 100,
    volatility: volatility,
    type: "probability"
  }));
});

const filteredMarket = markets
  .then(rows => {
    const filteredRows = rows.filter(row => row['adj_ticker'] === ticker);
    if (!filteredRows || filteredRows.length < 1) {
      window.location.href = '/';
    }
    return filteredRows;
  })
  .catch(error => {
    console.error('Error filtering market data:', error);
    window.location.href = '/';
  });
```

```js
let relatedNews = fetch('https://api.data.adj.news/api/news/market/' + filteredMarket[0].adj_ticker)
  .then(response => response.json())
  .then(data => {
    return data;
  })
  .catch(err => console.error(err));

let exaNews = fetch(`https://api.data.adj.news/api/news/${filteredMarket[0].title}`)
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

let relatedMarkets = fetch('https://api.data.adj.news/api/markets/related/' + filteredMarket[0].adj_ticker)
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
const defaultStartEnd = [
  new Date(tidy[Math.floor(tidy.length * 0.9)].date), 
  new Date(tidy[tidy.length - 1].date)
];
const startEnd = Mutable(defaultStartEnd);
const setStartEnd = (se) => startEnd.value = (se ?? defaultStartEnd);
const getStartEnd = () => startEnd.value;
```

```js
function frmCard(y, market) {
  const key = `probability`;

  const today = filteredTrades.at(-1).date;
  const yesterday = filteredTrades.find(d => new Date(d.date) < new Date(today));
  const yearAgo = filteredTrades.find(d => new Date(d.date) < new Date(today) && (new Date(today) - new Date(d.date)) / (1000 * 60 * 60 * 24) >= 365);
  const oneWeekAgo = filteredTrades.find(d => new Date(d.date) < new Date(today) && (new Date(today) - new Date(d.date)) / (1000 * 60 * 60 * 24) >= 7);
  const oneMonthAgo = filteredTrades.find(d => new Date(d.date) < new Date(today) && (new Date(today) - new Date(d.date)) / (1000 * 60 * 60 * 24) >= 30);

  const oneWeekChange = daily.at(-1).probability - (daily.at(-8) ? daily.at(-8).probability : 0);
  const tenDayAvg = d3.mean(daily.slice(-10), (d) => d.probability);
  const oneMonthAvg = d3.mean(daily.slice(-30), (d) => d.probability);
  
  const diff1 = filteredTrades.at(-1)[key] - (yesterday ? yesterday[key] : 0);
  const diffY = filteredTrades.at(-1)[key] - (yearAgo ? yearAgo[key] : 0);

  const avgVolatility = d3.mean(daily, (d) => d.volatility);

  const stroke = color.apply(`Probability`);

  return html.fragment`
    <h2>${y}</h2>
    <h1>${formatPercent(filteredTrades.at(-1)[key] * 100)}</h1>
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
        <td align="right">${formatPercent(tenDayAvg)}</td>
      </tr>
      <tr>
        <td>1-month average</td>
        <td align="right">${formatPercent(oneMonthAvg)}</td>
      </tr>
      <tr>
        <td>Average Volatility</td>
        <td align="right">${formatPercent(avgVolatility)}</td>
      </tr>
    </table>
    ${resize((width) =>
      Plot.plot({
        width,
        height: 40,
        axis: null,
        x: {inset: 40},
        marks: [
          Plot.tickX(daily.slice(-52), {
            x: key,
            stroke,
            insetTop: 10,
            insetBottom: 10,
            title: (d) => `${new Date(d.date)?.toLocaleDateString("en-us")}: ${d[key]}%`,
            tip: {anchor: "bottom"}
          }),
          Plot.tickX(daily.slice(-1), {x: key, strokeWidth: 1}),
          Plot.text([`${formatPercent(Math.min(daily[0][key], daily[daily.length - 1][key]), {signDisplay: "never"})}`], {frameAnchor: "left"}),
          Plot.text([`${formatPercent(Math.max(daily[0][key], daily[daily.length - 1][key]), {signDisplay: "never"})}`], {frameAnchor: "right"})
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
const filteredData = tidy.filter((d) => startEnd[0] <= new Date(d.date) && new Date(d.date) < startEnd[1])
      .map(d => ({...d, date: new Date(d.date)}));
const dates = filteredData.map(d => new Date(d.date));
const minDate = d3.min(dates);
const maxDate = d3.max(dates);
```

```js
const link = filteredMarket[0].link
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
  <h1>${filteredMarket[0]['question']}</h1>
  <code>${filteredMarket[0].adj_ticker}</code>
  <details open>
    <summary>Read Full Rules</summary>
    <p>${filteredMarket[0]['description']}</p>
  </details>
<div>

<div style="display: flex; gap: 10px;">
  <div>${Inputs.button([
    ["Trade", () => {
      window.open(link, '_blank');
    }],
    ["Download", () => {
      const header = Object.keys(daily[0]).filter(key => key !== 'type').join(',');
      const csv = daily.map(row => 
        Object.entries(row)
          .filter(([key]) => key !== 'type')
          .map(([, value]) => value)
          .join(',')
      ).join('\n');
      const csvWithHeader = `${header}\n${csv}`;
      const blob = new Blob([csvWithHeader], {type: 'text/csv'});
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const date = new Date();
      const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      link.download = `${filteredMarket[0].adj_ticker}-trades-${dateString}.csv`;
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
      <div style="position: relative; height: 10%;">
        <a href="#" style="position: absolute; bottom: 0; left: 0; text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;">Read More</a>
      </div>
    `}
  </div>
  <div class="card grid-colspan-2 grid-rowspan-2" style="display: flex; flex-direction: column;">
    <h2>Focused Probability</h2><br>
    <span style="flex-grow: 1;">${resize((width, height) =>
      Plot.plot({
        width,
        height,
        y: {grid: true, label: "Probability (%)"},
        x: {
          type: "time",
          domain: [minDate, maxDate],
          ticks: 10,
          label: "Date",
        },
        color,
        marks: [
          Plot.lineY(filteredData, {
            x: "date", 
            y: "probability",
            stroke: "type", 
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
        width,
        y: {grid: true, label: "Probability (%)"},
        color,
        marks: [
          Plot.ruleY([0]),
          Plot.lineY(tidy.map(d => ({...d, date: new Date(d.date)})), {x: "date", y: "probability", stroke: "type", tip: true}),
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

<div class="grid grid-cols-3 gap-4" style="margin-top: 2rem;">
  ${relatedMarkets.map(market => htl.html`
    <div class='card'>
      <h2>${market.question}</h2>
      <h1>${market.probability}%</h1>
      <table>
        <!-- <tr>
          <td>Probability</td>
          <td align="right">${formatPercent(market.probability, {signDisplay: "never"})}</td>
        </tr> -->
      </table>
    </div>
  `)}
</div>