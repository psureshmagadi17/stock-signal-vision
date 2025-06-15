
import { AWSService } from './awsService';
import { AlphaVantageStockData } from './alphaVantageService';

const awsService = AWSService.getInstance();

export const fetchStockDataFromLambda = async (symbol: string): Promise<AlphaVantageStockData> => {
  try {
    // Validate symbol format
    if (!/^[A-Z]{1,5}$/.test(symbol)) {
      throw new Error(`Invalid symbol format: ${symbol}`);
    }
    
    console.log(`Fetching stock data for ${symbol} from Lambda...`);
    
    // Call Lambda function via AWS Service
    const data = await awsService.fetchStockData(symbol);
    
    console.log(`Successfully fetched data for ${symbol}:`, data);
    
    return {
      symbol: data.symbol,
      currentPrice: data.currentPrice,
      change: data.change,
      changePercent: data.changePercent,
      volume: data.volume,
      marketCap: data.marketCap,
      historicalPrices: data.historicalPrices,
      candlestickData: data.candlestickData
    };
    
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to fetch data for ${symbol}. Please check the symbol and try again.`);
  }
};
