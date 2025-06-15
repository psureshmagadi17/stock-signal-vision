
import json
import boto3
import requests
import os
from typing import Dict, Any, List

def lambda_handler(event, context):
    """
    AWS Lambda function to fetch stock data from Alpha Vantage API
    """
    try:
        # Parse the request
        body = json.loads(event.get('body', '{}')) if event.get('body') else event
        symbol = body.get('symbol', '').upper()
        
        if not symbol:
            return {
                'statusCode': 400,
                'headers': get_cors_headers(),
                'body': json.dumps({'error': 'Symbol is required'})
            }
        
        # Validate symbol format
        if not symbol.isalpha() or len(symbol) > 5:
            return {
                'statusCode': 400,
                'headers': get_cors_headers(),
                'body': json.dumps({'error': f'Invalid symbol format: {symbol}'})
            }
        
        # Get API key from Parameter Store
        api_key = get_api_key()
        
        # Fetch stock data
        stock_data = fetch_stock_data(symbol, api_key)
        
        return {
            'statusCode': 200,
            'headers': get_cors_headers(),
            'body': json.dumps(stock_data)
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': get_cors_headers(),
            'body': json.dumps({'error': 'Internal server error'})
        }

def get_api_key() -> str:
    """Get Alpha Vantage API key from AWS Parameter Store"""
    try:
        ssm = boto3.client('ssm')
        parameter = ssm.get_parameter(
            Name='/stock-analyzer/alpha-vantage-api-key',
            WithDecryption=True
        )
        return parameter['Parameter']['Value']
    except Exception as e:
        print(f"Error getting API key: {e}")
        # Fallback for development
        return os.environ.get('ALPHA_VANTAGE_API_KEY', 'XD6TLWSCTVV8GMP0')

def fetch_stock_data(symbol: str, api_key: str) -> Dict[str, Any]:
    """Fetch stock data from Alpha Vantage API"""
    base_url = 'https://www.alphavantage.co/query'
    
    # Fetch daily time series
    time_series_params = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': symbol,
        'outputsize': 'compact',
        'apikey': api_key
    }
    
    # Fetch quote data
    quote_params = {
        'function': 'GLOBAL_QUOTE',
        'symbol': symbol,
        'apikey': api_key
    }
    
    try:
        # Make API calls
        time_series_response = requests.get(base_url, params=time_series_params, timeout=30)
        quote_response = requests.get(base_url, params=quote_params, timeout=30)
        
        time_series_data = time_series_response.json()
        quote_data = quote_response.json()
        
        # Check for API errors
        if 'Error Message' in time_series_data:
            raise Exception(f"API Error: {time_series_data['Error Message']}")
        
        if 'Note' in time_series_data:
            raise Exception(f"API Limit: {time_series_data['Note']}")
        
        # Process data
        time_series = time_series_data.get('Time Series (Daily)', {})
        quote = quote_data.get('Global Quote', {})
        
        if not time_series or not quote:
            raise Exception(f"No data found for symbol {symbol}")
        
        # Process historical data
        dates = sorted(time_series.keys())
        historical_prices = []
        candlestick_data = []
        
        for date in dates[-60:]:  # Last 60 days
            day_data = time_series[date]
            close_price = float(day_data['4. close'])
            historical_prices.append(close_price)
            
            candlestick_data.append({
                'date': date,
                'open': float(day_data['1. open']),
                'high': float(day_data['2. high']),
                'low': float(day_data['3. low']),
                'close': close_price,
                'volume': int(day_data['5. volume'])
            })
        
        # Extract current data
        current_price = float(quote['05. price'])
        change = float(quote['09. change'])
        change_percent = float(quote['10. change percent'].replace('%', ''))
        volume = int(quote['06. volume'])
        
        return {
            'symbol': symbol,
            'currentPrice': current_price,
            'change': change,
            'changePercent': change_percent,
            'volume': volume,
            'marketCap': f"${(current_price * 1000000000 / 1000000000):.1f}B",
            'historicalPrices': historical_prices,
            'candlestickData': candlestick_data
        }
        
    except requests.RequestException as e:
        print(f"Network error: {e}")
        raise Exception("Network error while fetching data")
    except Exception as e:
        print(f"Data processing error: {e}")
        raise

def get_cors_headers():
    """Return CORS headers for frontend integration"""
    return {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    }
