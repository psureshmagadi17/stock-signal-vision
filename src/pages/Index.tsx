import React, { useState } from 'react';
import { StockInput } from '@/components/StockInput';
import { StockAnalysis } from '@/components/StockAnalysis';
import { TrendingUp, BarChart3, Brain, Target } from 'lucide-react';
import { AlphaVantageStockData } from '@/services/alphaVantageService';

const Index = () => {
  const [analyzedStocks, setAnalyzedStocks] = useState<AlphaVantageStockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStockAnalysis = (stocks: AlphaVantageStockData[]) => {
    setAnalyzedStocks(stocks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-emerald-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Stock Analysis AI</h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real-time Alpha Vantage data with AlphaPy ML analysis and candlestick visualization
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <BarChart3 className="h-8 w-8 text-blue-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Alpha Vantage API</h3>
            <p className="text-slate-400">Real-time stock data with historical candlestick charts</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <Brain className="h-8 w-8 text-purple-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">AlphaPy ML Analysis</h3>
            <p className="text-slate-400">Advanced machine learning predictions with confidence scoring</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <Target className="h-8 w-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Candlestick Charts</h3>
            <p className="text-slate-400">Professional trading visualization with technical indicators</p>
          </div>
        </div>

        {/* Stock Input */}
        <div className="mb-8">
          <StockInput onAnalysis={handleStockAnalysis} isLoading={isLoading} setIsLoading={setIsLoading} />
        </div>

        {/* Analysis Results */}
        {analyzedStocks.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Analysis Results</h2>
            {analyzedStocks.map((stock) => (
              <StockAnalysis key={stock.symbol} stockData={stock} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
