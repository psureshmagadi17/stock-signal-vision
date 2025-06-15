
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { StockData } from '@/pages/Index';

interface StockChartProps {
  stockData: StockData;
  technicalData: any;
}

export const StockChart: React.FC<StockChartProps> = ({ stockData, technicalData }) => {
  // Generate chart data with last 30 days
  const chartData = stockData.historicalPrices.slice(-30).map((price, index) => ({
    day: index + 1,
    price: price,
    ma20: technicalData.ma20,
    ma50: technicalData.ma50,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 shadow-lg">
          <p className="text-slate-300">{`Day ${label}`}</p>
          <p className="text-white font-semibold">{`Price: $${payload[0].value.toFixed(2)}`}</p>
          {payload[1] && <p className="text-blue-400">{`MA20: $${payload[1].value.toFixed(2)}`}</p>}
          {payload[2] && <p className="text-purple-400">{`MA50: $${payload[2].value.toFixed(2)}`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="day" 
          stroke="#9CA3AF"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke="#9CA3AF"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${value.toFixed(0)}`}
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* Support and Resistance Lines */}
        <ReferenceLine 
          y={technicalData.support} 
          stroke="#10B981" 
          strokeDasharray="5 5" 
          label={{ value: "Support", position: "left" }}
        />
        <ReferenceLine 
          y={technicalData.resistance} 
          stroke="#EF4444" 
          strokeDasharray="5 5" 
          label={{ value: "Resistance", position: "left" }}
        />
        
        {/* Price Lines */}
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#FFFFFF" 
          strokeWidth={2}
          dot={{ fill: '#FFFFFF', strokeWidth: 0, r: 2 }}
          activeDot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="ma20" 
          stroke="#3B82F6" 
          strokeWidth={1}
          dot={false}
          strokeDasharray="3 3"
        />
        <Line 
          type="monotone" 
          dataKey="ma50" 
          stroke="#8B5CF6" 
          strokeWidth={1}
          dot={false}
          strokeDasharray="3 3"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
