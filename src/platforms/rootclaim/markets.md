```js
//
// Load data snapshots
//

// Rootclaim Markets 
const rootclaimMarkets = FileAttachment("../../data/rootclaim/rootclaim-markets.json").json();
```

```js
// "id": 291,
//         "question": "Who Killed Tair Rada?",
//         "created_at": "2023-01-19T00:00:00.000Z",
//         "url": "who-killed-tair-rada",
//         "slug": "tair-rada",
//         "comments_count": "1",
//         "cover_photo": {
//           "alt_text": null,
//           "image_url": "http://res.cloudinary.com/piogroup-net/image/upload/v1673882325/analysis_image/wrlmlpn902nxayrb89h3.png"
//         },
//         "isclaim": false,
//         "priority": 2120,
//         "scenarios": [
//           {
//             "name": "\u003Cp\u003ERoman Zdorov murdered Tair Rada.&nbsp;\u003C/p\u003E",
//             "tooltip": "",
//             "_sources": [null],
//             "max_range": 100,
//             "min_range": 0,
//             "created_at": "2022-12-25T10:00:56.576",
//             "short_name": "Zdorov",
//             "updated_at": "2022-12-25T10:00:56.576",
//             "is_rejected": false,
//             "show_tooltip": true,
//             "prior_likelihood": 0.079,
//             "inference_object_id": 291,
//             "net_prob": 1.25053475643125
//           },
//           {
//             "name": "\u003Cp\u003EBetween 1-4 Nofey Golan students murdered Tair Rada.&nbsp;\u003C/p\u003E",
//             "tooltip": "",
//             "_sources": [null],
//             "max_range": 100,
//             "min_range": 0,
//             "created_at": "2022-12-25T10:01:57.669",
//             "short_name": "Schoolmates",
//             "updated_at": "2022-12-25T10:01:57.669",
//             "is_rejected": false,
//             "show_tooltip": true,
//             "prior_likelihood": 2.42,
//             "inference_object_id": 291,
//             "net_prob": 0.383921867269121
//           },
//           {
//             "name": "\u003Cp\u003EOla Kravchenko murdered Tair Rada.&nbsp;\u003C/p\u003E",
//             "tooltip": "",
//             "_sources": [null],
//             "max_range": 100,
//             "min_range": 0,
//             "created_at": "2022-12-25T10:02:32.012",
//             "short_name": "Ola",
//             "updated_at": "2022-12-25T10:02:32.012",
//             "is_rejected": false,
//             "show_tooltip": true,
//             "prior_likelihood": 105,
//             "inference_object_id": 291,
//             "net_prob": 98.3655433762996
//           }
//         ]
//       },
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