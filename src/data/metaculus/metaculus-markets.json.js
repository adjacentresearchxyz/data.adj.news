// Fetch data from the API
fetch('https://metaforecast.org/api/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: `
      {
        questions(first: 100000 orderBy: FIRST_SEEN_DESC) {
          edges {
            node {
              id
              platform {
                id
              }
              title
              url
              description
              options {
                name
                probability
              }
              qualityIndicators {
                numForecasts
                stars
              }
              firstSeenStr
              fetchedStr
            }
          }
          pageInfo {
            endCursor
            startCursor
          }
        }
      }
    `,
  }),
})
.then(response => response.json())
.then(data => {
  // Filter and map the data
  const filteredData = data.data.questions.edges
    .filter(d => d.node.platform.id === 'metaculus')
    .filter(d => d.node.options)
    .filter(d => d.node.options.length === 2) // binary markets
    .filter(d => d.node.options.every(o => o.probability !== null)) // all probabilities
    .filter(d => d.node.description) // description
    .map((d) => ({
      "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
      "End Date": null,
      "Market": d.node.id,
      "Open Interest": null,
      "Volume": null,
      "Probability": (d.node.options[0].probability * 100).toFixed(2),
      "Question": {
        "Title": d.node.title,
        "URL": d.node.url,
      },
      "Description": d.node.description,
      "Forecasts": d.node.qualityIndicators.numForecasts,
      "Link": d.node.url,
      "News": {
        "Question": d.node.title,
        "URL": d.node.url,
      },
      "Status": "active", // @TODO This should be able to be pulled
      "Platform": "Metaculus",
    }));

  // Write the data to a stdout
  process.stdout.write(JSON.stringify(filteredData, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});