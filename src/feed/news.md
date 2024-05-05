```js
  // Get the market query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const market = urlParams.get('market');

  // Get the current date and the date one week ago
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);

  const news = await fetch('https://api.exa.ai/api/search', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'DNT': '1',
      'Origin': 'https://exa.ai',
      'Referer': 'https://exa.ai/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    },
    body: JSON.stringify({
      "query": market,
      "query_url_object":null,
      "num_results":10,
      "include_domains": ["bloomberg.com","reuters.com","businessinsider.com","ft.com", "nyt.com", "npr.org", "politico.com","wsj.com","cnbc.com","forbes.com","marketwatch.com", "seekingalpha.com"],
      "exclude_domains": ["twitter.com", "x.com"],
      "start_crawl_date": startDate.toISOString(),
      "end_crawl_date": endDate.toISOString(),
      "start_published_date": startDate.toISOString(),
      "end_published_date": endDate.toISOString(),
      "use_autoprompt":false,
      "category": "news"
    })
  })
  .then(response => response.json())
  .then(data => data.results
    .filter(result => result.title && result.publishedDate && result.author && result.author != "None")
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