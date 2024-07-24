import { createClient } from '@supabase/supabase-js'
import { pipeline } from '@xenova/transformers'

import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const fileName = path.basename(__filename);

// ------- Kalshi MARKETS -------
// https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_<date>.json
// [
//   {
//     "date": "2023-01-01",
//     "ticker_name": "CPTPP-23JAN4",
//     "report_ticker": "CPTPP",
//     "payout_type": "Binary Option",
//     "open_interest": 5499,
//     "daily_volume": 0,
//     "block_volume": 0,
//     "high": 2,
//     "low": 2,
//     "status": "active"
//   },
// ...
// ]

let data = [];

async function getDatedData(date) {
  console.log(`Fetching data for ${date}`)
  const url = `https://kalshi-public-docs.s3.amazonaws.com/reporting/market_data_${date}.json`;
  let response;
  try {
    response = await fetch(url).then(res => res.json());
  } catch (error) {
    console.error('Fetch error:', error);
    return;
  }

  const mappedMarkets = response.map(market => ({
    ticker: market.ticker_name,
    reported_date: date,
    end_date: null,
    market: market.ticker_name,
    open_interest: market.open_interest, // for $ markets
    volume: market.daily_volume + market.block_volume,
    probability: market.high, // @TODO pull from actual market to get current price
    question: null,
    description: null,
    forecasts: null, // for non $ markets
    link: "https://kalshi.com/markets/" + market.ticker_name,
    news: {
      question: null,
      url: "https://kalshi.com/markets/" + market.ticker_name,
    }, // in order to render news we need question and url
    platform: "Kalshi",
  }));
  data.push(...mappedMarkets);
}

async function getData(onlyYesterday = false) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // if (onlyYesterday) {
    await getDatedData(yesterday.toISOString().slice(0, 10));
  // } else {
  //   for (let date = yesterday; date >= new Date('2021-07-01'); date.setDate(date.getDate() - 1)) {
  //     await getDatedData(date.toISOString().slice(0, 10));
  //     await new Promise(resolve => setTimeout(resolve, 10000)); // wait 10 seconds before fetching the next date
  //   }
  // }

  return data
}  

// Assuming `getData` fetches an array of market data and `createClient` has been imported
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function processData() {
  const fetchedData = await getData();

  try {
    for (const market of fetchedData) {
      // Generate Embedding from Headline 
      const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');
      // Assuming `data.description` contains the text to generate embedding from
      const output = await generateEmbedding(market.ticker, {
        pooling: 'mean',
        normalize: true,
      });

      // Extract the embedding output
      const embedding = Array.from(output.data);

      // Insert into DB
      const { error } = await supabase
        .from('markets_data')
        .insert([
          {
            ticker: market.ticker,
            adj_ticker: "ADJ-KALSHI-" + market.ticker,
            reported_date: market.reported_date,
            end_date: market.end_date,
            market_slug: market.market_slug,
            open_interest: market.open_interest,
            volume: market.volume,
            probability: market.probability,
            question: market.question,
            description: market.description,
            forecasts: market.forecasts,
            link: market.link,
            platform: market.platform,
            status: market.status,
            question_embedding: embedding
          }
        ]);

      if (error) {
        console.error(`Error inserting data in ${fileName}: ${JSON.stringify(error)}`);
        return;
      }
    }
    console.log(`Data processing and insertion complete in file: ${fileName}`);
  } catch {
    console.log(`Skipping Market Date`)
  }
}

processData();