
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Settings } from 'lucide-react';
import { EnvironmentService } from '@/services/environmentService';

interface SecurityBannerProps {
  onOpenApiManager: () => void;
}

export const SecurityBanner: React.FC<SecurityBannerProps> = ({ onOpenApiManager }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [isUsingFallbackKey, setIsUsingFallbackKey] = useState(false);
  
  useEffect(() => {
    const environmentService = EnvironmentService.getInstance();
    const currentKey = environmentService.getApiKey();
    const usingFallback = currentKey === 'XD6TLWSCTVV8GMP0';
    
    setIsUsingFallbackKey(usingFallback);
    setShowBanner(usingFallback);
  }, []);
  
  if (!showBanner) return null;
  
  return (
    <Alert className="bg-yellow-900/20 border-yellow-800/30 mb-6">
      <AlertTriangle className="h-4 w-4 text-yellow-400" />
      <AlertDescription className="flex items-center justify-between">
        <div className="text-yellow-200">
          <strong>Security Notice:</strong> You're using a demo API key. 
          For better security and higher rate limits, please set your own Alpha Vantage API key.
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            onClick={onOpenApiManager}
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            <Settings className="h-3 w-3 mr-1" />
            Set API Key
          </Button>
          <Button
            onClick={() => setShowBanner(false)}
            variant="ghost"
            size="sm"
            className="text-yellow-400 hover:text-yellow-300"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
