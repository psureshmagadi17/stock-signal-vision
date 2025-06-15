
import { AWSService } from './awsService';
import { AlphaVantageStockData } from './alphaVantageService';
import { AlphaPyAnalysis } from './alphaPyService';

const awsService = AWSService.getInstance();

export const runAlphaPyAnalysisFromLambda = async (stockData: AlphaVantageStockData): Promise<AlphaPyAnalysis> => {
  try {
    console.log(`Running AlphaPy analysis for ${stockData.symbol} via Lambda...`);
    
    // Call Lambda function for AlphaPy analysis
    const analysis = await awsService.runAlphaPyAnalysis(stockData);
    
    console.log(`AlphaPy analysis completed for ${stockData.symbol}:`, analysis);
    
    return {
      confidence: analysis.confidence,
      successProbability: analysis.successProbability,
      riskScore: analysis.riskScore,
      currentSignal: analysis.currentSignal,
      recommendation: analysis.recommendation,
      buyLevels: analysis.buyLevels,
      sellLevels: analysis.sellLevels,
      technicalIndicators: analysis.technicalIndicators
    };
    
  } catch (error) {
    console.error(`Error running AlphaPy analysis for ${stockData.symbol}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to run AlphaPy analysis for ${stockData.symbol}. Please try again.`);
  }
};
