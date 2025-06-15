
# AWS Lambda Deployment Guide

This guide explains how to deploy the Stock Analysis Platform to AWS using Lambda functions.

## Overview

The platform now includes:
- **Lambda Functions**: Python-based backend for stock data fetching and AlphaPy analysis
- **API Gateway**: RESTful endpoints for frontend integration
- **Parameter Store**: Secure API key storage
- **CloudFormation**: Infrastructure as Code deployment

## Prerequisites

1. AWS CLI installed and configured
2. AWS account with appropriate permissions
3. Alpha Vantage API key

## Deployment Steps

### Option 1: CloudFormation (Recommended)

1. Deploy infrastructure:
```bash
aws cloudformation create-stack \
  --stack-name stock-analysis-platform \
  --template-body file://aws-lambda/cloudformation-template.yaml \
  --parameters ParameterKey=AlphaVantageAPIKey,ParameterValue=YOUR_API_KEY \
  --capabilities CAPABILITY_IAM
```

2. Upload Lambda function code:
```bash
cd aws-lambda
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

1. Create IAM role for Lambda execution
2. Deploy Lambda functions using the provided Python code
3. Set up API Gateway endpoints
4. Configure Parameter Store with your API key

## Lambda Functions

### 1. Stock Data Fetcher (`stock-data-fetcher`)
- **Runtime**: Python 3.9
- **Memory**: 256MB
- **Timeout**: 30 seconds
- **Purpose**: Fetch stock data from Alpha Vantage API

### 2. AlphaPy Analyzer (`alphapy-analyzer`)
- **Runtime**: Python 3.9
- **Memory**: 512MB
- **Timeout**: 60 seconds
- **Purpose**: Perform ML-based stock analysis using AlphaPy-style algorithms

## Frontend Configuration

1. Get your API Gateway URL from the CloudFormation outputs
2. In the app, click "Configure AWS" button
3. Enter your API Gateway URL
4. The app will now use Lambda functions instead of direct API calls

## Security Features

- API keys stored securely in AWS Parameter Store
- Lambda functions run with minimal IAM permissions
- API Gateway with throttling and monitoring
- CORS properly configured for frontend integration

## Benefits of AWS Deployment

- **Real AlphaPy Analysis**: Uses actual Python libraries instead of simulated analysis
- **Secure API Keys**: No API keys exposed in frontend code
- **Scalability**: Auto-scaling Lambda functions
- **Cost Effective**: Pay only for actual usage
- **Monitoring**: CloudWatch logs and metrics
- **Professional Architecture**: Enterprise-grade infrastructure

## Cost Estimation

- Lambda: ~$0.20 per 1M requests
- API Gateway: ~$3.50 per 1M requests
- Parameter Store: Free for standard parameters
- CloudWatch: Minimal cost for logs

## Troubleshooting

1. **Function not found**: Check CloudFormation stack deployment
2. **Permission errors**: Verify IAM roles and policies
3. **CORS issues**: Check API Gateway CORS configuration
4. **Timeout errors**: Increase Lambda timeout settings

## Next Steps

1. Set up CloudWatch alarms for monitoring
2. Configure custom domains for API Gateway
3. Implement caching for better performance
4. Add additional Lambda functions for portfolio analysis
