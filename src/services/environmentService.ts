
// Environment service to handle API keys and configuration securely
export class EnvironmentService {
  private static instance: EnvironmentService;
  private apiKey: string | null = null;
  
  private constructor() {}
  
  public static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }
  
  // Set API key from user input (stored in localStorage for demo purposes)
  public setApiKey(key: string): void {
    this.apiKey = key;
    // Store in localStorage for persistence (in production, this should be handled by backend)
    localStorage.setItem('alpha_vantage_api_key', key);
  }
  
  // Get API key from memory or localStorage
  public getApiKey(): string {
    if (this.apiKey) return this.apiKey;
    
    const storedKey = localStorage.getItem('alpha_vantage_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }
    
    // Fallback to hardcoded key (temporary - should be removed in production)
    console.warn('Using fallback API key. Please set your own API key for security.');
    return 'XD6TLWSCTVV8GMP0';
  }
  
  // Clear API key
  public clearApiKey(): void {
    this.apiKey = null;
    localStorage.removeItem('alpha_vantage_api_key');
  }
  
  // Validate API key format
  public isValidApiKey(key: string): boolean {
    return /^[A-Z0-9]{10,20}$/.test(key);
  }
}
