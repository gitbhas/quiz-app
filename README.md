# React App with AWS Amplify and Cognito

This is a React application that uses AWS Amplify and Cognito for user authentication.

## Setup Instructions

1. Install the AWS Amplify CLI:
```bash
npm install -g @aws-amplify/cli
```

2. Configure the Amplify CLI:
```bash
amplify configure
```

3. Initialize Amplify in the project:
```bash
amplify init
```

4. Add authentication:
```bash
amplify add auth
```
Choose the default configuration with username/password authentication.

5. Push the changes to AWS:
```bash
amplify push
```

6. Install dependencies:
```bash
npm install
```

7. Start the development server:
```bash
npm start
```

## Deployment

1. Create a new app in AWS Amplify Console
2. Connect your repository
3. Amplify will automatically deploy your application using the amplify.yml configuration

The application will be available at the URL provided by AWS Amplify Console.