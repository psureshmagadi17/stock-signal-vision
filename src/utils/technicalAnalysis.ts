
import { StockData } from '@/pages/Index';

export interface TechnicalIndicators {
  rsi: number;
  ma20: number;
  ma50: number;
  support: number;
  resistance: number;
  trend: 'bullish' | 'bearish' | 'neutral';
}

export interface MLAnalysis {
  confidence: 'High' | 'Medium' | 'Low';
  successProbability: number;
  riskScore: number;
  currentSignal: string;
  recommendation: string;
  buyLevels: Array<{
    price: number;
    probability: number;
    upside: number;
    target: number;
  }>;
  sellLevels: Array<{
    price: number;
    probability: number;
    downside: number;
    stopLoss: number;
  }>;
}

export const calculateTechnicalIndicators = (stockData: StockData): TechnicalIndicators => {
  const prices = stockData.historicalPrices;
  const currentPrice = stockData.currentPrice;
  
  // Calculate RSI (simplified version)
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < Math.min(prices.length, 15); i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      gains.push(change);
      losses.push(0);
    } else {
      gains.push(0);
      losses.push(Math.abs(change));
    }
  }
  
  const avgGain = gains.reduce((sum, gain) => sum + gain, 0) / gains.length;
  const avgLoss = losses.reduce((sum, loss) => sum + loss, 0) / losses.length;
  const rs = avgGain / (avgLoss || 0.01);
  const rsi = 100 - (100 / (1 + rs));
  
  // Calculate Moving Averages
  const ma20 = prices.slice(-20).reduce((sum, price) => sum + price, 0) / 20;
  const ma50 = prices.slice(-50).reduce((sum, price) => sum + price, 0) / 50;
  
  // Calculate Support and Resistance (simplified)
  const recentPrices = prices.slice(-30);
  const support = Math.min(...recentPrices) * 1.02; // 2% above recent low
  const resistance = Math.max(...recentPrices) * 0.98; // 2% below recent high
  
  // Determine trend
  let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (currentPrice > ma20 && ma20 > ma50) {
    trend = 'bullish';
  } else if (currentPrice < ma20 && ma20 < ma50) {
    trend = 'bearish';
  }
  
  return {
    rsi,
    ma20,
    ma50,
    support,
    resistance,
    trend,
  };
};

export const generateMLAnalysis = (stockData: StockData, technicalData: TechnicalIndicators): MLAnalysis => {
  const currentPrice = stockData.currentPrice;
  const { rsi, trend, support, resistance } = technicalData;
  
  // Generate confidence based on technical indicators
  let confidence: 'High' | 'Medium' | 'Low' = 'Medium';
  let successProbability = 60;
  let riskScore = 5;
  
  // Adjust confidence based on RSI and trend
  if ((rsi < 30 && trend === 'bullish') || (rsi > 70 && trend === 'bearish')) {
    confidence = 'High';
    successProbability = 75 + Math.floor(Math.random() * 15);
    riskScore = 3 + Math.floor(Math.random() * 3);
  } else if (rsi > 30 && rsi < 70 && trend !== 'neutral') {
    confidence = 'Medium';
    successProbability = 55 + Math.floor(Math.random() * 20);
    riskScore = 4 + Math.floor(Math.random() * 4);
  } else {
    confidence = 'Low';
    successProbability = 40 + Math.floor(Math.random() * 20);
    riskScore = 6 + Math.floor(Math.random() * 4);
  }
  
  // Generate buy levels
  const buyLevels = [
    {
      price: support,
      probability: 70 + Math.floor(Math.random() * 20),
      upside: 8 + Math.floor(Math.random() * 12),
      target: support * 1.15,
    },
    {
      price: currentPrice * 0.95,
      probability: 60 + Math.floor(Math.random() * 15),
      upside: 12 + Math.floor(Math.random() * 15),
      target: currentPrice * 1.18,
    },
  ];
  
  // Generate sell levels
  const sellLevels = [
    {
      price: resistance,
      probability: 65 + Math.floor(Math.random() * 20),
      downside: 6 + Math.floor(Math.random() * 8),
      stopLoss: resistance * 0.92,
    },
    {
      price: currentPrice * 1.05,
      probability: 55 + Math.floor(Math.random() * 15),
      downside: 10 + Math.floor(Math.random() * 12),
      stopLoss: currentPrice * 0.88,
    },
  ];
  
  // Generate current signal and recommendation
  let currentSignal = '';
  let recommendation = '';
  
  const distanceToSupport = ((currentPrice - support) / support) * 100;
  const distanceToResistance = ((resistance - currentPrice) / currentPrice) * 100;
  
  if (distanceToSupport < 3) {
    currentSignal = 'Near Support Level - Potential Buy Zone';
    recommendation = `Current price is ${distanceToSupport.toFixed(1)}% above support. Consider buying with a stop-loss below $${support.toFixed(2)}.`;
  } else if (distanceToResistance < 3) {
    currentSignal = 'Near Resistance Level - Potential Sell Zone';
    recommendation = `Current price is ${distanceToResistance.toFixed(1)}% below resistance. Consider taking profits or selling.`;
  } else if (rsi < 30) {
    currentSignal = 'Oversold Condition - Buy Signal';
    recommendation = 'RSI indicates oversold conditions. This could be a good buying opportunity for a bounce.';
  } else if (rsi > 70) {
    currentSignal = 'Overbought Condition - Sell Signal';
    recommendation = 'RSI indicates overbought conditions. Consider taking profits or waiting for a pullback.';
  } else {
    currentSignal = 'Neutral Zone - Wait for Clear Signal';
    recommendation = 'Price is in a neutral zone. Wait for a clear breakout or breakdown before taking a position.';
  }
  
  return {
    confidence,
    successProbability,
    riskScore,
    currentSignal,
    recommendation,
    buyLevels,
    sellLevels,
  };
};
