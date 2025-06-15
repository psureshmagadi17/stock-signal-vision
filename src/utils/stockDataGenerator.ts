
import { StockData } from '@/pages/Index';

const STOCK_INFO = {
  AAPL: { name: 'Apple Inc.', basePrice: 180, marketCap: '$2.8T' },
  MSFT: { name: 'Microsoft Corp.', basePrice: 340, marketCap: '$2.5T' },
  GOOGL: { name: 'Alphabet Inc.', basePrice: 140, marketCap: '$1.7T' },
  TSLA: { name: 'Tesla Inc.', basePrice: 220, marketCap: '$700B' },
  NVDA: { name: 'NVIDIA Corp.', basePrice: 450, marketCap: '$1.1T' },
  AMZN: { name: 'Amazon.com Inc.', basePrice: 150, marketCap: '$1.5T' },
  META: { name: 'Meta Platforms', basePrice: 310, marketCap: '$800B' },
  NFLX: { name: 'Netflix Inc.', basePrice: 400, marketCap: '$180B' },
};

export const generateMockStockData = (symbol: string): StockData => {
  const stockInfo = STOCK_INFO[symbol as keyof typeof STOCK_INFO] || {
    name: `${symbol} Corp.`,
    basePrice: 100 + Math.random() * 200,
    marketCap: `$${(Math.random() * 500 + 50).toFixed(0)}B`
  };

  const basePrice = stockInfo.basePrice;
  const currentVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
  const currentPrice = basePrice * (1 + currentVariation);
  
  const change = currentPrice - basePrice;
  const changePercent = (change / basePrice) * 100;

  // Generate 60 days of historical data
  const historicalPrices: number[] = [];
  let price = basePrice * 0.9; // Start 10% below current base
  
  for (let i = 0; i < 60; i++) {
    const dailyChange = (Math.random() - 0.5) * 0.05; // ±2.5% daily variation
    price = price * (1 + dailyChange);
    
    // Add some trend towards current price
    if (i > 30) {
      const trendFactor = (currentPrice - price) * 0.02;
      price += trendFactor;
    }
    
    historicalPrices.push(price);
  }

  // Ensure the last price is close to current price
  historicalPrices[historicalPrices.length - 1] = currentPrice;

  return {
    symbol,
    currentPrice,
    change,
    changePercent,
    volume: Math.floor(Math.random() * 50000000) + 10000000, // 10M - 60M volume
    marketCap: stockInfo.marketCap,
    historicalPrices,
  };
};
