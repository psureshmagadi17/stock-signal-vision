
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X, TrendingUp } from 'lucide-react';
import { generateMockStockData } from '@/utils/stockDataGenerator';
import { StockData } from '@/pages/Index';

interface StockInputProps {
  onAnalysis: (stocks: StockData[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const StockInput: React.FC<StockInputProps> = ({ onAnalysis, isLoading, setIsLoading }) => {
  const [tickers, setTickers] = useState<string[]>(['']);
  const [error, setError] = useState<string>('');

  const addTicker = () => {
    if (tickers.length < 5) {
      setTickers([...tickers, '']);
    }
  };

  const removeTicker = (index: number) => {
    if (tickers.length > 1) {
      setTickers(tickers.filter((_, i) => i !== index));
    }
  };

  const updateTicker = (index: number, value: string) => {
    const newTickers = [...tickers];
    newTickers[index] = value.toUpperCase();
    setTickers(newTickers);
    setError('');
  };

  const validateTicker = (ticker: string): boolean => {
    return /^[A-Z]{1,5}$/.test(ticker);
  };

  const handleAnalyze = async () => {
    const validTickers = tickers.filter(ticker => ticker.trim() !== '');
    
    if (validTickers.length === 0) {
      setError('Please enter at least one stock ticker');
      return;
    }

    const invalidTickers = validTickers.filter(ticker => !validateTicker(ticker));
    if (invalidTickers.length > 0) {
      setError(`Invalid ticker format: ${invalidTickers.join(', ')}`);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const stockData = validTickers.map(ticker => generateMockStockData(ticker));
      onAnalysis(stockData);
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-400 mr-2" />
            <h3 className="text-lg font-semibold text-white">Enter Stock Tickers</h3>
          </div>
          
          {tickers.map((ticker, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={ticker}
                onChange={(e) => updateTicker(index, e.target.value)}
                placeholder="Enter ticker (e.g., AAPL, MSFT)"
                className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400"
                maxLength={5}
              />
              {tickers.length > 1 && (
                <Button
                  onClick={() => removeTicker(index)}
                  variant="outline"
                  size="icon"
                  className="border-slate-600 text-slate-400 hover:text-red-400 hover:border-red-400"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            {tickers.length < 5 && (
              <Button
                onClick={addTicker}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Ticker
              </Button>
            )}
            
            <Button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Stocks'}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800/30">
              {error}
            </div>
          )}
          
          <p className="text-sm text-slate-400">
            Enter up to 5 stock tickers for analysis. Examples: AAPL, MSFT, GOOGL, TSLA, NVDA
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
