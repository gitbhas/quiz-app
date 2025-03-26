# Deployment Instructions

## Prerequisites
1. AWS Account
2. GitHub repository with your React application
3. AWS Amplify CLI installed and configured

## Steps to Deploy

### 1. Push your code to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Set up AWS Amplify
1. Go to AWS Management Console
2. Search for "AWS Amplify" and open it
3. Click "New app" → "Host web app"
4. Choose GitHub as your repository
5. Select your repository and branch
6. Review the build settings (they should be automatically detected from amplify.yml)
7. Click "Save and deploy"

### 3. Configure Environment Variables
1. In the Amplify Console, go to your app
2. Click on "Environment variables"
3. Add the following variables if needed:
   - AMPLIFY_REGION
   - AMPLIFY_AUTH_REGION
   - AMPLIFY_USER_POOL_ID
   - AMPLIFY_USER_POOL_WEB_CLIENT_ID

### 4. Set up Custom Domain (Optional)
1. In the Amplify Console, go to "Domain management"
2. Click "Add domain"
3. Follow the steps to configure your domain

### 5. Monitor Deployment
1. Watch the deployment progress in the Amplify Console
2. Check the build logs if there are any issues
3. Once deployed, your app will be available at the provided URL

### 6. Test Authentication
1. Visit your deployed application
2. Test user registration
3. Test sign in/sign out functionality
4. Verify that protected routes work as expected

### Troubleshooting
- Check CloudWatch logs for any issues
- Verify environment variables are set correctly
- Ensure AWS Amplify is properly configured in your code
- Confirm Cognito User Pool settings are correct