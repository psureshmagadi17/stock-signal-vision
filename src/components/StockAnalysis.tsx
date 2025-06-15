import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlphaVantageStockData } from '@/services/alphaVantageService';
import { runAlphaPyAnalysis, AlphaPyAnalysis } from '@/services/alphaPyService';
import { CandlestickChart } from '@/components/CandlestickChart';
import { TrendingUp, TrendingDown, Target, Brain, AlertTriangle } from 'lucide-react';

interface StockAnalysisProps {
  stockData: AlphaVantageStockData;
}

export const StockAnalysis: React.FC<StockAnalysisProps> = ({ stockData }) => {
  const [analysis, setAnalysis] = useState<AlphaPyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      try {
        const mlAnalysis = await runAlphaPyAnalysis(stockData);
        setAnalysis(mlAnalysis);
      } catch (error) {
        console.error('Error running AlphaPy analysis:', error);
      } finally {
        setIsAnalyzing(false);
      }
    };

    performAnalysis();
  }, [stockData]);

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-emerald-400' : 'text-red-400';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high': return 'bg-emerald-900/30 text-emerald-400 border-emerald-700';
      case 'medium': return 'bg-yellow-900/30 text-yellow-400 border-yellow-700';
      case 'low': return 'bg-red-900/30 text-red-400 border-red-700';
      default: return 'bg-slate-900/30 text-slate-400 border-slate-700';
    }
  };

  if (isAnalyzing || !analysis) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
        <CardContent className="p-8 text-center">
          <Brain className="h-8 w-8 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white">Running AlphaPy ML Analysis...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            {stockData.symbol}
            <span className="ml-3 text-lg font-normal text-slate-300">
              ${stockData.currentPrice.toFixed(2)}
            </span>
            <span className={`ml-2 text-sm ${getChangeColor(stockData.change)}`}>
              {stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} ({stockData.changePercent.toFixed(2)}%)
            </span>
          </CardTitle>
          <div className="text-right text-sm text-slate-400">
            <div>Volume: {stockData.volume.toLocaleString()}</div>
            <div>Market Cap: {stockData.marketCap}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Candlestick Chart */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="h-5 w-5 text-blue-400 mr-2" />
            Price Action & Technical Analysis
          </h3>
          <CandlestickChart stockData={stockData} analysis={analysis} />
        </div>

        {/* AlphaPy ML Analysis Results */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Brain className="h-5 w-5 text-purple-400 mr-2" />
              AlphaPy ML Analysis
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Confidence:</span>
                <Badge className={getConfidenceColor(analysis.confidence)}>
                  {analysis.confidence}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Success Probability:</span>
                <span className="text-white">{analysis.successProbability}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Score:</span>
                <span className={`font-medium ${
                  analysis.riskScore > 7 ? 'text-red-400' : 
                  analysis.riskScore > 4 ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {analysis.riskScore}/10
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Target className="h-5 w-5 text-blue-400 mr-2" />
              Advanced Indicators
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">RSI (14):</span>
                <span className={`font-medium ${
                  analysis.technicalIndicators.rsi > 70 ? 'text-red-400' : 
                  analysis.technicalIndicators.rsi < 30 ? 'text-emerald-400' : 'text-yellow-400'
                }`}>
                  {analysis.technicalIndicators.rsi.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MACD:</span>
                <span className={`font-medium ${analysis.technicalIndicators.macd > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {analysis.technicalIndicators.macd.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bollinger Upper:</span>
                <span className="text-white">${analysis.technicalIndicators.bollinger.upper.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bollinger Lower:</span>
                <span className="text-white">${analysis.technicalIndicators.bollinger.lower.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stochastic:</span>
                <span className={`font-medium ${
                  analysis.technicalIndicators.stochastic > 80 ? 'text-red-400' : 
                  analysis.technicalIndicators.stochastic < 20 ? 'text-emerald-400' : 'text-yellow-400'
                }`}>
                  {analysis.technicalIndicators.stochastic.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Buy/Sell Recommendations */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-emerald-900/20 border-emerald-800/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-emerald-400 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Buy Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.buyLevels.map((level, index) => (
                <div key={index} className="bg-emerald-900/30 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-emerald-300">${level.price.toFixed(2)}</span>
                    <Badge className="bg-emerald-800/50 text-emerald-300">
                      {level.probability}% chance
                    </Badge>
                  </div>
                  <div className="text-sm text-emerald-200">
                    Upside: +{level.upside}% | Target: ${level.target.toFixed(2)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-red-900/20 border-red-800/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-400 flex items-center">
                <TrendingDown className="h-5 w-5 mr-2" />
                Sell Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysis.sellLevels.map((level, index) => (
                <div key={index} className="bg-red-900/30 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-red-300">${level.price.toFixed(2)}</span>
                    <Badge className="bg-red-800/50 text-red-300">
                      {level.probability}% chance
                    </Badge>
                  </div>
                  <div className="text-sm text-red-200">
                    Downside: -{level.downside}% | Stop: ${level.stopLoss.toFixed(2)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Current Position Alert */}
        <Card className="bg-yellow-900/20 border-yellow-800/30">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <span className="font-semibold text-yellow-300">Current Position: </span>
                <span className="text-white">{analysis.currentSignal}</span>
              </div>
            </div>
            <p className="text-sm text-yellow-200 mt-2">{analysis.recommendation}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
