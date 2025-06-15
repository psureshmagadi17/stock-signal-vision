
import axios from 'axios';
import { EnvironmentService } from './environmentService';
import { RateLimitService } from './rateLimitService';

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

class AlphaVantageService {
  private environmentService = EnvironmentService.getInstance();
  private rateLimitService = RateLimitService.getInstance();
  
  private async makeSecureRequest(params: Record<string, string>): Promise<any> {
    const endpoint = params.function || 'unknown';
    
    // Check rate limits
    if (!this.rateLimitService.canMakeRequest(endpoint)) {
      const waitTime = this.rateLimitService.getNextAvailableTime(endpoint);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds before making another request.`);
    }
    
    // Add API key securely
    const secureParams = {
      ...params,
      apikey: this.environmentService.getApiKey()
    };
    
    try {
      const response = await axios.get(BASE_URL, {
        params: secureParams,
        timeout: 30000, // 30 second timeout
        headers: {
          'User-Agent': 'StockAnalysisApp/1.0'
        }
      });
      
      // Record successful request for rate limiting
      this.rateLimitService.recordRequest(endpoint);
      
      // Check for API errors
      if (response.data['Error Message']) {
        throw new Error(`API Error: ${response.data['Error Message']}`);
      }
      
      if (response.data['Note']) {
        throw new Error(`API Limit: ${response.data['Note']}`);
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.');
        }
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout. Please check your connection and try again.');
        }
      }
      throw error;
    }
  }
  
  async fetchStockData(symbol: string): Promise<AlphaVantageStockData> {
    try {
      // Validate symbol format
      if (!/^[A-Z]{1,5}$/.test(symbol)) {
        throw new Error(`Invalid symbol format: ${symbol}`);
      }
      
      // Fetch daily time series data
      const timeSeriesData = await this.makeSecureRequest({
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: 'compact'
      });

      // Fetch quote data for current price
      const quoteData = await this.makeSecureRequest({
        function: 'GLOBAL_QUOTE',
        symbol: symbol
      });

      const timeSeries = timeSeriesData['Time Series (Daily)'];
      const quote = quoteData['Global Quote'];

      if (!timeSeries || !quote) {
        throw new Error(`No data found for symbol ${symbol}. Please verify the symbol is correct.`);
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
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to fetch data for ${symbol}. Please check the symbol and try again.`);
    }
  }
}

// Export singleton instance
const alphaVantageService = new AlphaVantageService();
export const fetchStockData = (symbol: string) => alphaVantageService.fetchStockData(symbol);
