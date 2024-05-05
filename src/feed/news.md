```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('market');
```

```js
  import Exa from "npm:exa-js";

  // Get the current date and the date one week ago
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  // const exa = new Exa(process.env.EXA_API_KEY)
  const exa = new Exa('8419346d-fcca-4911-a8d5-08cbe5f51778')
  const results = await exa.search(market, {
      useAutoprompt: false,
      type: 'keyword',
      endCrawlDate: startDate.toISOString(),
      endPublishedDate: endDate.toISOString(),
      startCrawlDate: startDate.toISOString(),
      startPublishedDate: endDate.toISOString(),
  });

  const news = await results.results
  .filter(result => result.title && result.publishedDate)
  .map(result => ({
    Article: {
      title: result.title,
      url: result.url
    },
    Published: result.publishedDate,
    Source: result.author
  }))
```

<div>
  <h3>News</h3>
  <a href="https://exa.ai" target="_blank">Powered by Exa</a>
  <p>> <code>${market}</code></p>
  <div>
      ${Inputs.table(news, {
      rows: 30, 
      sort: "Comments", 
      reverse: true,
      layout: "auto",
      columns: ["Article", "Published", "Source"],
      format: {
        "Article": d => htl.html`<a href="${d.url}" target="_blank">${d.title.substring(0,50) + "..."}</a>`,
        "Published": d => d,
        "Source": d => d.substring(0,25)
      }
    })}
  </div>
</div>