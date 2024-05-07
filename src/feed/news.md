```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('market');
```

```js
  // Fetch news data
  const results = await fetch(`https://api.adj.news/api/news?market=${market}`, {
    mode: 'no-cors'
  });

  console.log(results)

  const news = await results.news.results.results
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
  Powered by <a href="https://exa.ai" target="_blank" class="dotted">Exa</a>
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