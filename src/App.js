import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

// Configure Amplify
Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_example',
    userPoolWebClientId: 'example-client-id',
    mandatorySignIn: true,
  }
});

function App({ signOut, user }) {
  useEffect(() => {
    document.title = 'Quiz App';
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Quiz Application</h1>
          <nav className="main-nav">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/quiz">Take Quiz</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li>
                <button className="sign-out-button" onClick={signOut}>
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={
              <div className="home-container">
                <h2>Welcome, {user.username}!</h2>
                <div className="home-content">
                  <p>This quiz application allows you to take quizzes with various question types:</p>
                  <ul>
                    <li>Dropdown selection questions</li>
                    <li>Yes/No radio button questions</li>
                    <li>Multiple selection dropdown lists</li>
                    <li>Text input questions</li>
                  </ul>
                  <p>Your results will be saved and can be viewed on the dashboard.</p>
                  <div className="home-actions">
                    <Link to="/quiz" className="action-button">Start Quiz</Link>
                    <Link to="/dashboard" className="action-button secondary">View Results</Link>
                  </div>
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} Quiz App. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);