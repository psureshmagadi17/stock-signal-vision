
// AWS Lambda integration service
export class AWSService {
  private static instance: AWSService;
  private baseUrl: string;
  
  private constructor() {
    // Load from localStorage if available, otherwise use placeholder
    const savedUrl = localStorage.getItem('aws_api_gateway_url');
    this.baseUrl = savedUrl || 'https://your-api-gateway-url.amazonaws.com/prod';
  }
  
  public static getInstance(): AWSService {
    if (!AWSService.instance) {
      AWSService.instance = new AWSService();
    }
    return AWSService.instance;
  }
  
  // Set API Gateway URL
  public setApiGatewayUrl(url: string): void {
    this.baseUrl = url;
  }
  
  // Fetch stock data from Lambda
  public async fetchStockData(symbol: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/stock-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
  
  // Run AlphaPy analysis via Lambda
  public async runAlphaPyAnalysis(stockData: any): Promise<any> {
    const response = await fetch(`${this.baseUrl}/alphapy-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stockData })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
}
