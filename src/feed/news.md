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
    mode: 'cors',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-api-key': '8419346d-fcca-4911-a8d5-08cbe5f51778'
    },
    body: JSON.stringify({
      query: 'Will Destiny talk to Sneako in May 2024?',
      useAutoprompt: false,
      type: 'keyword',
      endCrawlDate: '2024-05-05T15:01:41.358Z',
      endPublishedDate: '2024-05-05T15:01:41.358Z',
      startCrawlDate: '2024-04-28T15:01:41.358Z',
      startPublishedDate: '2024-04-28T15:01:41.358Z'
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
  <h1>News</h1>
  <h4>Powered by <a href="https://exa.ai" target="_blank">Exa</a></h4>
  <br />
  <p>> <i>${market}</i></p>
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