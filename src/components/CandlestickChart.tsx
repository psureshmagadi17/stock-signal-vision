
import React from 'react';
import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line, Bar } from 'recharts';
import { AlphaVantageStockData } from '@/services/alphaVantageService';
import { AlphaPyAnalysis } from '@/services/alphaPyService';

interface CandlestickChartProps {
  stockData: AlphaVantageStockData;
  analysis: AlphaPyAnalysis;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ stockData, analysis }) => {
  // Prepare data for candlestick chart (last 30 days)
  const chartData = stockData.candlestickData.slice(-30).map((candle, index) => ({
    date: new Date(candle.date).toLocaleDateString(),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume,
    day: index + 1,
    // Add candlestick body data
    bodyTop: Math.max(candle.open, candle.close),
    bodyBottom: Math.min(candle.open, candle.close),
    bodyHeight: Math.abs(candle.close - candle.open),
    isGreen: candle.close > candle.open
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-600 shadow-lg">
          <p className="text-slate-300 font-medium mb-2">{data.date}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-400">Open: ${data.open.toFixed(2)}</p>
            <p className="text-blue-400">High: ${data.high.toFixed(2)}</p>
            <p className="text-red-400">Low: ${data.low.toFixed(2)}</p>
            <p className="text-white font-semibold">Close: ${data.close.toFixed(2)}</p>
            <p className="text-slate-400">Volume: {data.volume.toLocaleString()}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom candlestick rendering function
  const renderCandlestick = (props: any) => {
    const { payload, x, width } = props;
    if (!payload) return null;
    
    const { open, high, low, close } = payload;
    const isRising = close > open;
    const color = isRising ? '#10B981' : '#EF4444';
    
    // Calculate positions
    const centerX = x + width / 2;
    const bodyWidth = width * 0.6;
    const bodyLeft = centerX - bodyWidth / 2;
    
    // Find Y positions based on chart scale
    const yScale = props.yAxisMap?.y || ((val: number) => val);
    const highY = yScale(high);
    const lowY = yScale(low);
    const openY = yScale(open);
    const closeY = yScale(close);
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(closeY - openY);
    
    return (
      <g key={`candlestick-${x}`}>
        {/* Wick line */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body rectangle */}
        <rect
          x={bodyLeft}
          y={bodyTop}
          width={bodyWidth}
          height={bodyHeight || 1}
          fill={isRising ? color : 'transparent'}
          stroke={color}
          strokeWidth={1}
        />
      </g>
    );
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="day" 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
            domain={['dataMin - 2', 'dataMax + 2']}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Invisible bar to create proper scaling */}
          <Bar dataKey="high" fill="transparent" />
          <Bar dataKey="low" fill="transparent" />
          
          {/* Bollinger Bands */}
          <ReferenceLine 
            y={analysis.technicalIndicators.bollinger.upper} 
            stroke="#8B5CF6" 
            strokeDasharray="3 3" 
            label={{ value: "Upper BB", position: "left" }}
          />
          <ReferenceLine 
            y={analysis.technicalIndicators.bollinger.middle} 
            stroke="#3B82F6" 
            strokeDasharray="2 2" 
            label={{ value: "Middle BB", position: "left" }}
          />
          <ReferenceLine 
            y={analysis.technicalIndicators.bollinger.lower} 
            stroke="#8B5CF6" 
            strokeDasharray="3 3" 
            label={{ value: "Lower BB", position: "left" }}
          />
          
          {/* Buy/Sell Levels */}
          {analysis.buyLevels.map((level, index) => (
            <ReferenceLine 
              key={`buy-${index}`}
              y={level.price} 
              stroke="#10B981" 
              strokeDasharray="5 5" 
              label={{ value: `Buy ${level.probability}%`, position: "right" }}
            />
          ))}
          {analysis.sellLevels.map((level, index) => (
            <ReferenceLine 
              key={`sell-${index}`}
              y={level.price} 
              stroke="#EF4444" 
              strokeDasharray="5 5" 
              label={{ value: `Sell ${level.probability}%`, position: "right" }}
            />
          ))}
          
          {/* Close price line */}
          <Line type="monotone" dataKey="close" stroke="#FFFFFF" strokeWidth={1} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Technical Indicators Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="text-slate-400">RSI</div>
          <div className={`font-bold ${
            analysis.technicalIndicators.rsi > 70 ? 'text-red-400' : 
            analysis.technicalIndicators.rsi < 30 ? 'text-emerald-400' : 'text-yellow-400'
          }`}>
            {analysis.technicalIndicators.rsi.toFixed(1)}
          </div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="text-slate-400">MACD</div>
          <div className={`font-bold ${analysis.technicalIndicators.macd > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {analysis.technicalIndicators.macd.toFixed(2)}
          </div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="text-slate-400">Stochastic</div>
          <div className={`font-bold ${
            analysis.technicalIndicators.stochastic > 80 ? 'text-red-400' : 
            analysis.technicalIndicators.stochastic < 20 ? 'text-emerald-400' : 'text-yellow-400'
          }`}>
            {analysis.technicalIndicators.stochastic.toFixed(1)}
          </div>
        </div>
        <div className="bg-slate-700/50 p-3 rounded-lg">
          <div className="text-slate-400">BB Position</div>
          <div className={`font-bold ${
            stockData.currentPrice > analysis.technicalIndicators.bollinger.upper ? 'text-red-400' : 
            stockData.currentPrice < analysis.technicalIndicators.bollinger.lower ? 'text-emerald-400' : 'text-yellow-400'
          }`}>
            {stockData.currentPrice > analysis.technicalIndicators.bollinger.upper ? 'Above' :
             stockData.currentPrice < analysis.technicalIndicators.bollinger.lower ? 'Below' : 'Within'}
          </div>
        </div>
      </div>
    </div>
  );
};
