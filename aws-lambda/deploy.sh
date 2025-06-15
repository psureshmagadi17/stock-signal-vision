
#!/bin/bash

# AWS Lambda Deployment Script
# Make sure to configure AWS CLI first: aws configure

echo "Deploying Stock Analysis Lambda Functions..."

# Deploy Stock Data Fetcher
echo "Deploying stock-data-fetcher..."
cd stock-data-fetcher
zip -r ../stock-data-fetcher.zip .
aws lambda create-function \
  --function-name stock-data-fetcher \
  --runtime python3.9 \
  --role arn:aws:iam::YOUR-ACCOUNT-ID:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://../stock-data-fetcher.zip \
  --timeout 30 \
  --memory-size 256

# Deploy AlphaPy Analyzer
echo "Deploying alphapy-analyzer..."
cd ../alphapy-analyzer
zip -r ../alphapy-analyzer.zip .
aws lambda create-function \
  --function-name alphapy-analyzer \
  --runtime python3.9 \
  --role arn:aws:iam::YOUR-ACCOUNT-ID:role/lambda-execution-role \
  --handler lambda_function.lambda_handler \
  --zip-file fileb://../alphapy-analyzer.zip \
  --timeout 60 \
  --memory-size 512

echo "Creating API Gateway..."
# Create API Gateway (this would be done via AWS Console or CloudFormation)

echo "Setting up Parameter Store..."
# Store API key in Parameter Store
aws ssm put-parameter \
  --name "/stock-analyzer/alpha-vantage-api-key" \
  --value "YOUR-ALPHA-VANTAGE-API-KEY" \
  --type "SecureString" \
  --description "Alpha Vantage API Key for Stock Analyzer"

echo "Deployment complete!"
echo "Make sure to:"
echo "1. Update the IAM role ARN in this script"
echo "2. Set up API Gateway endpoints"
echo "3. Configure CORS settings"
echo "4. Update your Alpha Vantage API key in Parameter Store"
