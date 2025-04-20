import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import './Dashboard.css';

const Dashboard = () => {
    const [quizResults, setQuizResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchUserAndResults = async () => {
            try {
                // Get the current authenticated user
                const user = await Auth.currentAuthenticatedUser();
                const username = user.username;
                setUserId(username);
                
                // Fetch results for this user
                await fetchResults(username);
            } catch (error) {
                console.error('Error fetching user or results:', error);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };
        
        fetchUserAndResults();
    }, []);

    const fetchResults = async (username) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/quiz/results?userId=${username}`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }
            
            const data = await response.json();
            setQuizResults(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            setError('Failed to load quiz results. Please try again later.');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const renderAnswerDetails = (answers) => {
        if (!answers) return null;
        
        return (
            <div className="answer-details">
                <h4>Your Answers:</h4>
                <ul>
                    {Object.entries(answers).map(([questionIndex, answer]) => {
                        const displayAnswer = Array.isArray(answer) 
                            ? answer.join(', ') 
                            : answer;
                            
                        return (
                            <li key={questionIndex}>
                                <strong>Question {parseInt(questionIndex) + 1}:</strong> {displayAnswer}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    if (loading) {
        return <div className="dashboard-container loading">Loading results...</div>;
    }

    if (error) {
        return <div className="dashboard-container error">{error}</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Quiz Results Dashboard</h2>
            <p className="user-info">Results for: <strong>{userId}</strong></p>
            
            {quizResults.length === 0 ? (
                <div className="no-results">
                    <p>You haven't taken any quizzes yet.</p>
                </div>
            ) : (
                <div className="results-section">
                    <div className="results-summary">
                        <h3>Summary</h3>
                        <p>Total Quizzes Taken: {quizResults.length}</p>
                        <p>Average Score: {
                            (quizResults.reduce((sum, result) => sum + (result.score / result.totalQuestions) * 100, 0) / quizResults.length).toFixed(2)
                        }%</p>
                    </div>
                    
                    <h3>Quiz History</h3>
                    <div className="results-list">
                        {quizResults.map((result, index) => (
                            <div key={result.id} className="result-card">
                                <div className="result-header">
                                    <h4>Quiz #{quizResults.length - index}</h4>
                                    <span className="result-date">{formatDate(result.timestamp)}</span>
                                </div>
                                <div className="result-stats">
                                    <p>Score: <strong>{result.score} / {result.totalQuestions}</strong></p>
                                    <p>Percentage: <strong>{((result.score / result.totalQuestions) * 100).toFixed(2)}%</strong></p>
                                </div>
                                {renderAnswerDetails(result.answers)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;