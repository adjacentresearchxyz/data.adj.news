import fs from 'fs';
import archiver from 'archiver';

async function fetchAllMarkets() {
  let lastId;
  let allMarkets = [];

  while (true) {
    const url = `https://api.manifold.markets/v0/markets?limit=1000${lastId ? `&before=${lastId}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.length < 1000) {
      allMarkets = allMarkets.concat(data);
      break;
    }

    lastId = data[data.length - 1].id;
    allMarkets = allMarkets.concat(data);
  }

  return allMarkets
    .filter(d => d.probability != null)
    .map((d) => ({
    "Reported Date": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').slice(0, 16),
    "End Date": null,
    "Market": d.slug,
    "Open Interest": null,
    "Volume": d.volume / 1000, // MANA is 1/1000 in USD if converted
    "Probability": isNaN(d.probability * 100) ? "" : (d.probability * 100).toFixed(2),
    "Question": {
      "Title": d.question,
      "URL": d.url,
    },
    "Description": d.question,
    "Forecasts": d.uniqueBettorCount,
    "Link": d.url,
    "News": {
      "Question": d.question,
      "URL": d.url,
    },
    "Status": d.isResolved ? "finalized" : "active",
    "Platform": "Manifold",
  }));
}

fetchAllMarkets()
  .then(markets => {
    fs.writeFileSync('markets.json', JSON.stringify(markets));

    const output = fs.createWriteStream('markets.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.pipe(process.stdout);
    archive.file('markets.json', { name: 'markets.json' });
    archive.finalize();
  })
  .catch(error => console.error(error));