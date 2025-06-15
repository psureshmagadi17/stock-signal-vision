
// Rate limiting service to prevent API abuse
export class RateLimitService {
  private static instance: RateLimitService;
  private requests: Map<string, number[]> = new Map();
  
  // Alpha Vantage free tier: 5 requests per minute, 500 per day
  private readonly REQUESTS_PER_MINUTE = 5;
  private readonly REQUESTS_PER_DAY = 500;
  private readonly MINUTE_MS = 60 * 1000;
  private readonly DAY_MS = 24 * 60 * 60 * 1000;
  
  private constructor() {}
  
  public static getInstance(): RateLimitService {
    if (!RateLimitService.instance) {
      RateLimitService.instance = new RateLimitService();
    }
    return RateLimitService.instance;
  }
  
  public canMakeRequest(endpoint: string): boolean {
    const now = Date.now();
    const key = `alphavantage_${endpoint}`;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key)!;
    
    // Clean old requests
    const recentRequests = requests.filter(time => now - time < this.DAY_MS);
    const lastMinuteRequests = recentRequests.filter(time => now - time < this.MINUTE_MS);
    
    // Check limits
    if (lastMinuteRequests.length >= this.REQUESTS_PER_MINUTE) {
      return false;
    }
    
    if (recentRequests.length >= this.REQUESTS_PER_DAY) {
      return false;
    }
    
    return true;
  }
  
  public recordRequest(endpoint: string): void {
    const now = Date.now();
    const key = `alphavantage_${endpoint}`;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    this.requests.get(key)!.push(now);
  }
  
  public getNextAvailableTime(endpoint: string): number {
    const now = Date.now();
    const key = `alphavantage_${endpoint}`;
    const requests = this.requests.get(key) || [];
    
    const lastMinuteRequests = requests.filter(time => now - time < this.MINUTE_MS);
    
    if (lastMinuteRequests.length >= this.REQUESTS_PER_MINUTE) {
      const oldestRequest = Math.min(...lastMinuteRequests);
      return oldestRequest + this.MINUTE_MS - now;
    }
    
    return 0;
  }
}
