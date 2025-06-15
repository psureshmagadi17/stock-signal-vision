
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Key, AlertTriangle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { EnvironmentService } from '@/services/environmentService';

interface ApiKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [error, setError] = useState('');
  
  const environmentService = EnvironmentService.getInstance();
  
  useEffect(() => {
    const currentKey = environmentService.getApiKey();
    setHasKey(currentKey !== 'XD6TLWSCTVV8GMP0'); // Check if using fallback key
  }, []);
  
  const handleSaveKey = () => {
    setError('');
    
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }
    
    if (!environmentService.isValidApiKey(apiKey)) {
      setError('Invalid API key format. Should be 10-20 alphanumeric characters.');
      return;
    }
    
    environmentService.setApiKey(apiKey);
    setHasKey(true);
    setApiKey('');
    onClose();
  };
  
  const handleClearKey = () => {
    environmentService.clearApiKey();
    setHasKey(false);
    setApiKey('');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Key className="h-5 w-5 mr-2 text-yellow-400" />
            API Key Manager
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
              {hasKey ? (
                <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Secure Key Set
                </Badge>
              ) : (
                <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-700">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Using Fallback Key
                </Badge>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Alpha Vantage API Key:</label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Alpha Vantage API key"
                className="bg-slate-700 border-slate-600 text-white pr-10"
              />
              <Button
                type="button"
                onClick={() => setShowKey(!showKey)}
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:text-white"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              <strong>Security Notice:</strong> Your API key is stored locally in your browser.
            </p>
            <p>
              Get your free API key from{' '}
              <a 
                href="https://www.alphavantage.co/support/#api-key" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Alpha Vantage
              </a>
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleSaveKey}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={!apiKey.trim()}
            >
              Save Key
            </Button>
            {hasKey && (
              <Button
                onClick={handleClearKey}
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
