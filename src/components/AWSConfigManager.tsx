
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Cloud, AlertTriangle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { AWSService } from '@/services/awsService';

interface AWSConfigManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AWSConfigManager: React.FC<AWSConfigManagerProps> = ({ isOpen, onClose }) => {
  const [apiGatewayUrl, setApiGatewayUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  const [error, setError] = useState('');
  
  const awsService = AWSService.getInstance();
  
  useEffect(() => {
    // Check if AWS configuration exists
    const savedUrl = localStorage.getItem('aws_api_gateway_url');
    setHasConfig(!!savedUrl);
  }, []);
  
  const handleSaveConfig = () => {
    setError('');
    
    if (!apiGatewayUrl.trim()) {
      setError('Please enter an API Gateway URL');
      return;
    }
    
    try {
      new URL(apiGatewayUrl); // Validate URL format
    } catch {
      setError('Please enter a valid URL');
      return;
    }
    
    // Save configuration
    localStorage.setItem('aws_api_gateway_url', apiGatewayUrl);
    awsService.setApiGatewayUrl(apiGatewayUrl);
    
    setHasConfig(true);
    setApiGatewayUrl('');
    onClose();
  };
  
  const handleClearConfig = () => {
    localStorage.removeItem('aws_api_gateway_url');
    setHasConfig(false);
    setApiGatewayUrl('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-orange-400" />
            AWS Configuration
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Status:</span>
              {hasConfig ? (
                <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  AWS Configured
                </Badge>
              ) : (
                <Badge className="bg-orange-900/30 text-orange-400 border-orange-700">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  AWS Not Configured
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-400">API Gateway URL:</label>
            <div className="relative">
              <Input
                type={showUrl ? 'text' : 'password'}
                value={apiGatewayUrl}
                onChange={(e) => setApiGatewayUrl(e.target.value)}
                placeholder="https://your-api-id.execute-api.region.amazonaws.com/prod"
                className="bg-slate-700 border-slate-600 text-white pr-10"
              />
              <Button
                type="button"
                onClick={() => setShowUrl(!showUrl)}
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:text-white"
              >
                {showUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-800/30">
                {error}
              </div>
            )}
          </div>
          
          <div className="bg-slate-700/50 p-3 rounded-lg text-xs text-slate-400">
            <p className="mb-2">
              <strong>AWS Configuration:</strong> Enter your API Gateway URL to connect to Lambda functions.
            </p>
            <p>
              This enables real AlphaPy analysis and secure API key handling via AWS.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSaveConfig}
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={!apiGatewayUrl.trim()}
            >
              Save Config
            </Button>
            {hasConfig && (
              <Button
                onClick={handleClearConfig}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
