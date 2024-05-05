```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('market');

  // Get the current date and the date one week ago
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': '8419346d-fcca-4911-a8d5-08cbe5f51778'
    },
    body: JSON.stringify({
      query: market,
      type: 'keyword',
      // includeDomains: ["bloomberg.com","reuters.com","businessinsider.com","ft.com", "nyt.com", "npr.org", "politico.com","wsj.com","cnbc.com","forbes.com","marketwatch.com", "seekingalpha.com", "twitter.com", "x.com"],
      excludeDomains: null,
      startCrawlDate: startDate.toISOString(),
      endCrawlDate: endDate.toISOString(),
      startPublishedDate: startDate.toISOString(),
      endPublishedDate: endDate.toISOString(),
      useAutoprompt: false,
    })
  };

  const news = await fetch('https://api.exa.ai/search', options)
  .then(response => response.json())
  .then(data => data.results
    .filter(result => result.title && result.publishedDate)
    .map(result => ({
      ...result,
      Article: {
        title: result.title,
        url: result.url
      },
      Published: result.publishedDate,
      Source: result.author
    })))
  .catch(error => console.error('Error:', error));
```

<div>
  <p>${market}</p>
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