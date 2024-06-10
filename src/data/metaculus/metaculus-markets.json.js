import fs from 'fs/promises';
import path from 'path';

// Function to fetch data from the API
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();

  // If there is a next page, fetch it
  if (data.next) {
    const nextPageData = await fetchData(data.next);
    return data.results.concat(nextPageData);
  } else {
    return data.results;
  }
}

// Start fetching data
async function fetchAndProcessData() {
  try {
    const data = await fetchData('https://www.metaculus.com/api2/questions?limit=100&status=open');
    
    // Filter and map the data
    const filteredData = data
      .filter(d => d.possibilities.type === 'binary') // @TODO for now only binary markets
      .filter(d => d.number_of_forecasters > 0)
      .filter(d => d.prediction_count > 0)
      .filter(d => d.possibilities && d.possibilities.type === 'binary') // only support binary markets rn
      .map((d) => ({
        "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
        "End Date": d.close_time,
        "Market": d.id,
        "Open Interest": null, // not a real money market
        "Volume": d.prediction_count, // @TODO how to map this into real money
        "Probability": (d.community_prediction.full.q2 * 100).toFixed(2), // charts are split into q1, q2, q3 with q2 being the median
        "Question": {
          "Title": d.title,
          "URL": "https://www.metaculus.com/" + d.page_url,
        },
        "Description": d.description,
        "Forecasts": d.number_of_forecasters,
        "Link": d.page_url,
        "News": {
          "Question": d.title,
          "URL": "https://www.metaculus.com/" + d.page_url,
        },
        "Status": d.active_state === 'RESOLVED' ? 'finalized' : 'active',
        "Platform": "Metaculus",
      }));

    // Load a local file and append it 
    const collection = JSON.parse(await fs.readFile(path.resolve('src/data/metaculus/resolvedData.json'), 'utf-8'));
    const finalData = filteredData.concat(collection);

    // Write the data to a stdout
    process.stdout.write(JSON.stringify(finalData, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchAndProcessData();