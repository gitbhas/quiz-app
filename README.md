# Quiz Application

A Vite React application for creating and taking quizzes with various question types. Results are stored in a local JSON file and can be viewed on a dashboard.

## Features

- User authentication with AWS Amplify
- Various question types:
  - Dropdown selection questions
  - Yes/No radio button questions
  - Multiple selection dropdown lists
  - Text input questions
- Results tracking by user ID
- Dashboard to view quiz history and performance

## Tech Stack

- Frontend: React with Vite
- Backend: Express.js (Node.js) or FastAPI (Python)
- Authentication: AWS Amplify
- Data Storage: Local JSON file

## Prerequisites

- Node.js (v14 or higher)
- Python 3.7+ (if using FastAPI backend)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. If using FastAPI backend, install Python dependencies:

```bash
pip install fastapi uvicorn
```

## Configuration

1. Update AWS Amplify configuration in `src/App.js` with your AWS credentials:

```javascript
Amplify.configure({
  Auth: {
    region: 'your-region',
    userPoolId: 'your-user-pool-id',
    userPoolWebClientId: 'your-client-id',
    mandatorySignIn: true,
  }
});
```

## Running the Application

### Using Express.js Backend

```bash
npm run dev
```

This will start both the React frontend and Express.js backend concurrently.

### Using FastAPI Backend

```bash
npm run api  # Start the FastAPI backend
npm start    # In another terminal, start the React frontend
```

## Project Structure

- `/public` - Static assets
- `/src` - React application source code
  - `/components` - React components
  - `/utils` - Utility functions
- `/api` - FastAPI backend (optional)
- `server.js` - Express.js backend
- `quiz_results.json` - Local storage for quiz results

## License

MIT