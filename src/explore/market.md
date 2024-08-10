# Will Donald Trump win the 2024 US Presidential Election?

```js
const market = FileAttachment("../data/api/markets.csv").csv({typed: true});
const tidy = market.then((rows) => rows.flatMap(({date, probability, daily_volatility}) => [{date: date, probability: probability * 100, type: "Probability"}]));
const daily = market.then((rows) => {
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
    type: "probability"
  }));
});
```

```js
const color = Plot.scale({color: {domain: ["Probability", "Volatility"]}});
const colorLegend = (y) => html`<span style="border-bottom: solid 2px ${color.apply(`${y}Y FRM`)};">${y}-year fixed-probability</span>`;
```

```js
const defaultStartEnd = tidy.length > 53 ? [new Date(tidy.at(-53).date), new Date(tidy.at(-1).date)] : [new Date(tidy.at(-tidy.length).date), new Date(tidy.at(-1).date)];
const startEnd = Mutable(defaultStartEnd);
const setStartEnd = (se) => startEnd.value = (se ?? defaultStartEnd);
const getStartEnd = () => startEnd.value;
```

```js
function frmCard(y, market) {
  const key = `probability`;

  const today = market.at(-1).date;
  const yesterday = market.find(d => new Date(d.date) < new Date(today));
  const yearAgo = market.find(d => new Date(d.date) < new Date(today) && (new Date(today) - new Date(d.date)) / (1000 * 60 * 60 * 24) >= 365);
  const oneWeekAgo = market.find(d => new Date(d.date) < new Date(today) && (new Date(today) - new Date(d.date)) / (1000 * 60 * 60 * 24) >= 7);
  const oneMonthAgo = market.find(d => new Date(d.date) < new Date(today) && (new Date(today) - new Date(d.date)) / (1000 * 60 * 60 * 24) >= 30);

  const oneWeekChange = daily.at(-1).probability - (daily.at(-8) ? daily.at(-8).probability : 0);
  const tenDayAvg = d3.mean(daily.slice(-10), (d) => d.probability);
  const oneMonthAvg = d3.mean(daily.slice(-30), (d) => d.probability);
  
  const diff1 = market.at(-1)[key] - (yesterday ? yesterday[key] : 0);
  const diffY = market.at(-1)[key] - (yearAgo ? yearAgo[key] : 0);

  const stroke = color.apply(`Probability`);

  return html.fragment`
    <h2>${y}</h2>
    <h1>${formatPercent(market.at(-1)[key])}</h1>
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
function newsCard(market) {
  return html.fragment`
    <h2>Related News</h2>
    <table>
      <tr>
        <td>
          <a href="#" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;"><h3>Harris Leads Trump in Three Key States, Times/Siena Polls Find - NYT</h3></a>
        </td>
        <td align="right">
          <p>08.10.24</p>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;"><h3>Donald Trump v Kamala Harris: who's ahead in the polls? - Economist</h3></a>
        </td>
        <td align="right">
          <p>08.10.24</p>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;"><h3>Trump and Harris agree to debate on Sept. 10 - AP</h3></a>
        </td>
        <td align="right">
          <p>08.08.24</p>
        </td>
      </tr>
      <tr>
        <td>
          <a href="#" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;"><h3>Arizona Republican who fought Trump’s false election claims loses primary - PBS</h3></a>
        </td>
        <td align="right">
          <p>08.07.24</p>
        </td>
      </tr>
    </table>
    <a href="#" style="text-decoration: underline; text-decoration-thickness: 0.5px; text-underline-offset: 1px;">Read More</a>
  `;
}
```

```js
const filteredData = tidy.filter((d) => startEnd[0] <= new Date(d.date) && new Date(d.date) < startEnd[1])
      .map(d => ({...d, date: new Date(d.date)}));
const dates = filteredData.map(d => new Date(d.date));
const minDate = d3.min(dates);
const maxDate = d3.max(dates);
```

<code>ADJ-POLYMARKET-WILL-DONALD-TRUMP-WIN-THE-2024-US-PRESIDENTIAL-ELECTION</code>

This market will resolve to “Yes” if Donald J. Trump wins the 2024 US Presidential Election. Otherwise, this market will resolve to “No.”

The resolution source for this market is the Associated Press, Fox News, and NBC. This market will resolve once all three sources call the race for the same candidate. If all three sources haven’t called the race for the same candidate by the inauguration date (January 20, 2025) this market will resolve based on who is inauguprobabilityd.

<style type="text/css">

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

<div class="grid grid-cols-2-3" style="margin-top: 2rem;">
  <div class="card">${frmCard('Probability', market)}</div>
  <div class="card">${newsCard(market)}</div>
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
            curve: "step", 
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