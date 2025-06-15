
import axios from 'axios';

const API_KEY = 'XD6TLWSCTVV8GMP0';
const BASE_URL = 'https://www.alphavantage.co/query';

export interface AlphaVantageStockData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  historicalPrices: number[];
  candlestickData: Array<{
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }>;
}

export const fetchStockData = async (symbol: string): Promise<AlphaVantageStockData> => {
  try {
    // Fetch daily time series data
    const timeSeriesResponse = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY,
        outputsize: 'compact'
      }
    });

    // Fetch quote data for current price
    const quoteResponse = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    const timeSeries = timeSeriesResponse.data['Time Series (Daily)'];
    const quote = quoteResponse.data['Global Quote'];

    if (!timeSeries || !quote) {
      throw new Error(`No data found for symbol ${symbol}`);
    }

    // Process time series data
    const dates = Object.keys(timeSeries).sort();
    const historicalPrices: number[] = [];
    const candlestickData = dates.slice(-60).map(date => {
      const dayData = timeSeries[date];
      const close = parseFloat(dayData['4. close']);
      historicalPrices.push(close);
      
      return {
        date,
        open: parseFloat(dayData['1. open']),
        high: parseFloat(dayData['2. high']),
        low: parseFloat(dayData['3. low']),
        close: close,
        volume: parseInt(dayData['5. volume'])
      };
    });

    // Extract current data from quote
    const currentPrice = parseFloat(quote['05. price']);
    const change = parseFloat(quote['09. change']);
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
    const volume = parseInt(quote['06. volume']);

    // Estimate market cap (simplified - would need additional API call for accurate data)
    const estimatedMarketCap = `$${(currentPrice * 1000000000 / 1000000000).toFixed(1)}B`;

    return {
      symbol,
      currentPrice,
      change,
      changePercent,
      volume,
      marketCap: estimatedMarketCap,
      historicalPrices,
      candlestickData
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw new Error(`Failed to fetch data for ${symbol}. Please check the symbol and try again.`);
  }
};
