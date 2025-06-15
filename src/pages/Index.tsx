
import React, { useState } from 'react';
import { StockInput } from '@/components/StockInput';
import { StockAnalysis } from '@/components/StockAnalysis';
import { SecurityBanner } from '@/components/SecurityBanner';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { AWSConfigManager } from '@/components/AWSConfigManager';
import { AlphaVantageStockData } from '@/services/alphaVantageService';
import { Shield, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [stockData, setStockData] = useState<AlphaVantageStockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiManager, setShowApiManager] = useState(false);
  const [showAWSManager, setShowAWSManager] = useState(false);

  const handleAnalysis = (data: AlphaVantageStockData[]) => {
    setStockData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-emerald-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">
              Secure Stock Analysis Platform
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-4">
            Advanced ML-powered stock analysis with AlphaPy integration
          </p>
          <p className="text-sm text-slate-400 mb-4">
            Protected by enterprise-grade security measures
          </p>
          
          {/* AWS Configuration Button */}
          <div className="flex justify-center gap-4 mt-4">
            <Button
              onClick={() => setShowAWSManager(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Cloud className="h-4 w-4 mr-2" />
              Configure AWS
            </Button>
          </div>
        </div>

        {/* Security Banner */}
        <SecurityBanner onOpenApiManager={() => setShowApiManager(true)} />

        {/* Stock Input */}
        <div className="mb-8">
          <StockInput 
            onAnalysis={handleAnalysis} 
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>

        {/* Stock Analysis Results */}
        {stockData.length > 0 && (
          <div className="space-y-8">
            {stockData.map((stock) => (
              <StockAnalysis key={stock.symbol} stockData={stock} />
            ))}
          </div>
        )}

        {/* API Key Manager Modal */}
        <ApiKeyManager 
          isOpen={showApiManager}
          onClose={() => setShowApiManager(false)}
        />

        {/* AWS Configuration Modal */}
        <AWSConfigManager 
          isOpen={showAWSManager}
          onClose={() => setShowAWSManager(false)}
        />
      </div>
    </div>
  );
};

export default Index;
