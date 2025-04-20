import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import './Quiz.css';

const Quiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get the current authenticated user
        const fetchUser = async () => {
            try {
                const user = await Auth.currentAuthenticatedUser();
                setUserId(user.username);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, []);

    const quizData = [
        {
            question: "What is your favorite programming language?",
            type: "dropdown",
            options: ["JavaScript", "Python", "Java", "C++", "Ruby", "Go"],
            points: 1
        },
        {
            question: "Do you have experience with React?",
            type: "radio",
            options: ["Yes", "No"],
            points: 1
        },
        {
            question: "Select all the tools you are familiar with:",
            type: "dropdown-multi",
            options: ["Git", "Docker", "AWS", "Jenkins", "Kubernetes", "Terraform"],
            points: 1
        },
        {
            question: "Describe your experience with web development:",
            type: "text",
            points: 1
        },
        {
            question: "How many years of programming experience do you have?",
            type: "dropdown",
            options: ["Less than 1 year", "1-3 years", "3-5 years", "5-10 years", "More than 10 years"],
            points: 1
        },
        {
            question: "Are you interested in learning new technologies?",
            type: "radio",
            options: ["Yes", "No"],
            points: 1
        },
        {
            question: "What areas of software development are you most interested in?",
            type: "dropdown-multi",
            options: ["Frontend", "Backend", "DevOps", "Mobile", "Data Science", "Machine Learning", "Security"],
            points: 1
        },
        {
            question: "Briefly explain why you are interested in this position:",
            type: "text",
            points: 1
        }
    ];

    const handleAnswer = (answer) => {
        // Save the answer
        const updatedAnswers = { ...answers };
        updatedAnswers[currentQuestion] = answer;
        setAnswers(updatedAnswers);

        // Calculate score for this question
        const currentQuestionData = quizData[currentQuestion];
        if (currentQuestionData.type === "radio" && answer === "Yes") {
            setScore(score + currentQuestionData.points);
        } else if (currentQuestionData.type !== "radio") {
            setScore(score + currentQuestionData.points);
        }

        // Move to next question or finish quiz
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < quizData.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            finishQuiz(updatedAnswers);
        }
    };

    const finishQuiz = async (finalAnswers) => {
        try {
            // Save quiz results
            const response = await fetch('/api/quiz/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    score,
                    totalQuestions: quizData.length,
                    userId,
                    answers: finalAnswers
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save results');
            }

            setShowResults(true);
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    };

    const renderQuestion = () => {
        const currentQuestionData = quizData[currentQuestion];

        switch (currentQuestionData.type) {
            case 'dropdown':
                return (
                    <div className="question-container">
                        <h3>{currentQuestionData.question}</h3>
                        <select 
                            className="dropdown-select"
                            onChange={(e) => handleAnswer(e.target.value)}
                            defaultValue=""
                        >
                            <option value="" disabled>Select an option</option>
                            {currentQuestionData.options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            
            case 'radio':
                return (
                    <div className="question-container">
                        <h3>{currentQuestionData.question}</h3>
                        <div className="radio-options">
                            {currentQuestionData.options.map((option, index) => (
                                <div key={index} className="radio-option">
                                    <input
                                        type="radio"
                                        id={`option-${index}`}
                                        name="radio-option"
                                        value={option}
                                        onChange={() => handleAnswer(option)}
                                    />
                                    <label htmlFor={`option-${index}`}>{option}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            
            case 'dropdown-multi':
                return (
                    <div className="question-container">
                        <h3>{currentQuestionData.question}</h3>
                        <select 
                            className="dropdown-select"
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                handleAnswer(selectedOptions);
                            }}
                            multiple
                            size={currentQuestionData.options.length}
                        >
                            {currentQuestionData.options.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <p className="help-text">Hold Ctrl (or Cmd on Mac) to select multiple options</p>
                    </div>
                );
            
            case 'text':
                return (
                    <div className="question-container">
                        <h3>{currentQuestionData.question}</h3>
                        <textarea
                            className="text-input"
                            rows="4"
                            placeholder="Type your answer here..."
                            onChange={(e) => handleAnswer(e.target.value)}
                        />
                        <button 
                            className="submit-button"
                            onClick={() => {
                                const textValue = document.querySelector('.text-input').value;
                                if (textValue.trim()) {
                                    handleAnswer(textValue);
                                }
                            }}
                        >
                            Submit Answer
                        </button>
                    </div>
                );
            
            default:
                return <div>Unknown question type</div>;
        }
    };

    if (showResults) {
        return (
            <div className="quiz-container">
                <h2>Quiz Complete!</h2>
                <p>Thank you for completing the quiz.</p>
                <button 
                    className="dashboard-button"
                    onClick={() => navigate('/dashboard')}
                >
                    View Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h2>Quiz</h2>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                    ></div>
                </div>
                <p className="question-counter">Question {currentQuestion + 1} of {quizData.length}</p>
            </div>
            
            {renderQuestion()}
        </div>
    );
};

export default Quiz;