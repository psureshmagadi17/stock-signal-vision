
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StockData } from '@/pages/Index';
import { calculateTechnicalIndicators, generateMLAnalysis } from '@/utils/technicalAnalysis';
import { StockChart } from '@/components/StockChart';
import { TrendingUp, TrendingDown, Target, Brain, AlertTriangle } from 'lucide-react';

interface StockAnalysisProps {
  stockData: StockData;
}

export const StockAnalysis: React.FC<StockAnalysisProps> = ({ stockData }) => {
  const technicalData = calculateTechnicalIndicators(stockData);
  const mlAnalysis = generateMLAnalysis(stockData, technicalData);
  
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
        {/* Chart */}
        <div className="h-64">
          <StockChart stockData={stockData} technicalData={technicalData} />
        </div>

        {/* Technical Indicators */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Target className="h-5 w-5 text-blue-400 mr-2" />
              Technical Indicators
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">RSI (14):</span>
                <span className={`font-medium ${
                  technicalData.rsi > 70 ? 'text-red-400' : 
                  technicalData.rsi < 30 ? 'text-emerald-400' : 'text-yellow-400'
                }`}>
                  {technicalData.rsi.toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MA (20):</span>
                <span className="text-white">${technicalData.ma20.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MA (50):</span>
                <span className="text-white">${technicalData.ma50.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Support:</span>
                <span className="text-emerald-400">${technicalData.support.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resistance:</span>
                <span className="text-red-400">${technicalData.resistance.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Brain className="h-5 w-5 text-purple-400 mr-2" />
              ML Analysis
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Confidence:</span>
                <Badge className={getConfidenceColor(mlAnalysis.confidence)}>
                  {mlAnalysis.confidence}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Success Probability:</span>
                <span className="text-white">{mlAnalysis.successProbability}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Score:</span>
                <span className={`font-medium ${
                  mlAnalysis.riskScore > 7 ? 'text-red-400' : 
                  mlAnalysis.riskScore > 4 ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {mlAnalysis.riskScore}/10
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
              {mlAnalysis.buyLevels.map((level, index) => (
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
              {mlAnalysis.sellLevels.map((level, index) => (
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
                <span className="text-white">{mlAnalysis.currentSignal}</span>
              </div>
            </div>
            <p className="text-sm text-yellow-200 mt-2">{mlAnalysis.recommendation}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
