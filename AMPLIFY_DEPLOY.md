# Deploying React Quiz App to AWS Amplify

Follow these steps to deploy your React Quiz application to AWS Amplify:

## Prerequisites

1. Install the AWS Amplify CLI if you haven't already:
```bash
npm install -g @aws-amplify/cli
```

2. Configure the Amplify CLI with your AWS credentials:
```bash
amplify configure
```

## Deployment Steps

1. Initialize Amplify in your project:
```bash
amplify init
```
- Choose a name for your environment (e.g., 'dev')
- Choose your default editor
- Choose 'Javascript' as your type of app
- Choose 'React' as your framework
- Accept the default build settings

2. Add hosting to your Amplify project:
```bash
amplify add hosting
```
- Choose 'Hosting with Amplify Console'
- Choose 'Manual deployment'

3. Copy the aws-exports-template.js to aws-exports.js and update with your configuration values.

4. Deploy your application:
```bash
amplify push
amplify publish
```

## Important Configuration Files

1. Make sure your `amplify.yml` contains the correct build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

2. Ensure your `src/index.js` includes Amplify configuration:
```javascript
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);
```

## Environment Variables

If your app requires any environment variables, configure them in the Amplify Console under App settings > Environment variables.

## Post-Deployment

1. After deployment, you can access your application at the URL provided by Amplify Console.
2. You can manage your application through the AWS Amplify Console.
3. Any subsequent updates can be deployed by pushing to your connected repository or running `amplify publish`

## Troubleshooting

- If you encounter build errors, check the build logs in the Amplify Console
- Ensure all required dependencies are listed in package.json
- Verify that aws-exports.js is properly configured
- Check that authentication is properly set up if you're using Cognito

For more detailed information, visit the [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html).