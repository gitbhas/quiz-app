# AWS DynamoDB Setup Instructions

## Prerequisites
1. An AWS account
2. AWS CLI installed locally
3. Proper AWS credentials with DynamoDB permissions

## Configuration Steps

1. Install AWS SDK:
```bash
npm install aws-sdk
```

2. Set up AWS Credentials
   Choose one of the following methods:

   a. Environment Variables:
   ```bash
   export AWS_ACCESS_KEY_ID=your_access_key
   export AWS_SECRET_ACCESS_KEY=your_secret_key
   export AWS_REGION=us-east-1
   export DYNAMODB_TABLE=quiz-results
   ```

   b. AWS Credentials file:
   Create or edit ~/.aws/credentials:
   ```
   [default]
   aws_access_key_id = your_access_key
   aws_secret_access_key = your_secret_key
   ```

   Create or edit ~/.aws/config:
   ```
   [default]
   region = us-east-1
   ```

3. DynamoDB Table
   The application will automatically create a table named 'quiz-results' if it doesn't exist.
   You can override the table name by setting the DYNAMODB_TABLE environment variable.

## IAM Policy
Ensure your AWS user/role has the following permissions:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:CreateTable",
                "dynamodb:DescribeTable",
                "dynamodb:PutItem",
                "dynamodb:Scan"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/quiz-results"
        }
    ]
}
```