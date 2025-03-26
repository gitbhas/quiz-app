import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Quiz.css';

const Quiz = () => {
    const [currentRound, setCurrentRound] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();

    const quizData = [
        // Round 1: Multiple Choice
        {
            round: 1,
            questions: [
                {
                    question: "What is React?",
                    options: [
                        "A JavaScript library for building user interfaces",
                        "A database management system",
                        "A programming language",
                        "An operating system"
                    ],
                    correct: 0,
                    type: "multiple-choice"
                },
                {
                    question: "Which hook is used for side effects in React?",
                    options: [
                        "useState",
                        "useEffect",
                        "useContext",
                        "useReducer"
                    ],
                    correct: 1,
                    type: "multiple-choice"
                },
                {
                    question: "What is JSX?",
                    options: [
                        "A JavaScript XML syntax",
                        "A JavaScript compiler",
                        "A React framework",
                        "A package manager"
                    ],
                    correct: 0,
                    type: "multiple-choice"
                }
            ]
        },
        // Round 2: Show and Tell
        {
            round: 2,
            questions: [
                {
                    question: "Explain how React components work and provide an example.",
                    type: "show-tell",
                    answer: ""
                },
                {
                    question: "Describe the difference between props and state in React.",
                    type: "show-tell",
                    answer: ""
                },
                {
                    question: "Explain the concept of React hooks and list three commonly used hooks.",
                    type: "show-tell",
                    answer: ""
                }
            ]
        },
        // Round 3: Multiple Choice Advanced
        {
            round: 3,
            questions: [
                {
                    question: "What is the Virtual DOM?",
                    options: [
                        "A lightweight copy of the actual DOM",
                        "A browser extension",
                        "A JavaScript engine",
                        "A React component"
                    ],
                    correct: 0,
                    type: "multiple-choice"
                },
                {
                    question: "Which lifecycle method is called after a component updates?",
                    options: [
                        "componentDidMount",
                        "componentWillUpdate",
                        "componentDidUpdate",
                        "componentWillMount"
                    ],
                    correct: 2,
                    type: "multiple-choice"
                }
            ]
        }
    ];

    const handleAnswer = (selectedAnswer) => {
        const currentQuestionData = quizData[currentRound - 1].questions[currentQuestion];
        
        if (currentQuestionData.type === "multiple-choice") {
            if (selectedAnswer === currentQuestionData.correct) {
                setScore(score + 1);
            }
        } else {
            // Handle show and tell answers
            // Save the answer for review
            currentQuestionData.answer = selectedAnswer;
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizData[currentRound - 1].questions.length) {
            setCurrentQuestion(nextQuestion);
        } else if (currentRound < quizData.length) {
            setCurrentRound(currentRound + 1);
            setCurrentQuestion(0);
        } else {
            setShowResults(true);
            saveResults();
        }
    };

    const saveResults = async () => {
        try {
            const response = await fetch('/api/quiz/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score,
                    totalQuestions: quizData.reduce((acc, round) => acc + round.questions.length, 0),
                    timestamp: new Date().toISOString()
                })
            });
            if (!response.ok) {
                throw new Error('Failed to save results');
            }
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    };

    if (showResults) {
        return (
            <div className="quiz-container">
                <h2>Quiz Complete!</h2>
                <p>Your score: {score}</p>
                <button onClick={() => navigate('/dashboard')}>View Dashboard</button>
            </div>
        );
    }

    const currentQuestionData = quizData[currentRound - 1].questions[currentQuestion];

    return (
        <div className="quiz-container">
            <h2>Round {currentRound}</h2>
            <div className="question">
                <h3>{currentQuestionData.question}</h3>
                {currentQuestionData.type === "multiple-choice" ? (
                    <div className="options">
                        {currentQuestionData.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className="option-button"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="show-tell">
                        <textarea
                            rows="4"
                            placeholder="Enter your answer..."
                            onChange={(e) => handleAnswer(e.target.value)}
                        />
                        <button onClick={() => handleAnswer(currentQuestionData.answer)}>
                            Submit Answer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;