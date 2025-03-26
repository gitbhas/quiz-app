import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [quizResults, setQuizResults] = useState([]);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await fetch('/api/quiz/results');
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }
            const data = await response.json();
            setQuizResults(data);
        } catch (error) {
            console.error('Error fetching quiz results:', error);
        }
    };

    return (
        <div className="dashboard-container">
            <h2>Quiz Results Dashboard</h2>
            <div className="results-table">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Total Questions</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizResults.map((result, index) => (
                            <tr key={index}>
                                <td>{new Date(result.timestamp).toLocaleDateString()}</td>
                                <td>{result.score}</td>
                                <td>{result.totalQuestions}</td>
                                <td>{((result.score / result.totalQuestions) * 100).toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;