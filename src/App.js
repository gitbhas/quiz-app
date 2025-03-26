import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import Quiz from './components/Quiz';
import Dashboard from './components/Dashboard';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  return (
    <Router>
      <div>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', padding: '20px' }}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/quiz">Take Quiz</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button onClick={signOut}>Sign Out</button></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={
            <div style={{ padding: '20px' }}>
              <h1>Welcome {user.username}</h1>
              <p>Start a quiz or view your results in the dashboard!</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);