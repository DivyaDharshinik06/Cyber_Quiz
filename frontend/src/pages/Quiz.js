// pages/Quiz.js - Core quiz game page
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions, submitQuiz } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Timer from '../components/Timer';
import Navbar from '../components/Navbar';

const Quiz = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null); // { correct: bool, explanation, correctAnswer }
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timerKey, setTimerKey] = useState(0); // changes to reset timer
  const [answers, setAnswers] = useState([]); // track all answers for result page

  // Load questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getQuestions(level);
        setQuestions(res.data.questions);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [level]);

  const currentQuestion = questions[currentIndex];

  // Handle answer selection
  const handleAnswer = useCallback((option) => {
    if (selectedAnswer !== null || feedback !== null) return; // already answered

    const isCorrect = option === currentQuestion.correct_answer;
    setSelectedAnswer(option);

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setFeedback({
      correct: isCorrect,
      correctAnswer: currentQuestion.correct_answer,
      explanation: currentQuestion.explanation,
    });

    setAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        selected: option,
        correct: currentQuestion.correct_answer,
        isCorrect,
        explanation: currentQuestion.explanation,
      },
    ]);
  }, [selectedAnswer, feedback, currentQuestion]);

  // Timer ran out — auto-submit wrong answer
  const handleTimeUp = useCallback(() => {
    if (feedback !== null) return;
    handleAnswer('__TIME_UP__');
  }, [feedback, handleAnswer]);

  // Move to next question or finish quiz
  const handleNext = async () => {
    if (currentIndex + 1 >= questions.length) {
      // Quiz finished — submit results
      try {
        const finalScore = answers.filter((a) => a.isCorrect).length + (feedback?.correct ? 0 : 0);
        const res = await submitQuiz({
          level: parseInt(level),
          score,
          total: questions.length,
        });
        // Update user context with new credits/level
        updateUser({
          credits: res.data.newCredits,
          current_level: res.data.newLevel,
          levels_completed: res.data.newLevelsCompleted,
        });
        // Navigate to result page with state
        navigate('/result', {
          state: {
            level: parseInt(level),
            score,
            total: questions.length,
            passed: res.data.passed,
            creditsEarned: res.data.creditsEarned,
            newCredits: res.data.newCredits,
            answers,
          },
        });
      } catch (err) {
        setError('Failed to submit quiz. Please try again.');
      }
    } else {
      // Next question
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setFeedback(null);
      setTimerKey((k) => k + 1); // reset timer
    }
  };

  if (loading) return <div className="loading-screen">Loading questions... 🔄</div>;
  if (error) return <div className="error-screen">❌ {error}</div>;
  if (!currentQuestion) return null;

  const options = [
    currentQuestion.option1,
    currentQuestion.option2,
    currentQuestion.option3,
    currentQuestion.option4,
  ];

  const getOptionClass = (option) => {
    if (!feedback) return 'option-btn';
    if (option === currentQuestion.correct_answer) return 'option-btn correct';
    if (option === selectedAnswer && !feedback.correct) return 'option-btn wrong';
    return 'option-btn disabled';
  };

  return (
    <div className="page">
      <Navbar />
      <div className="quiz-container">
        {/* Header */}
        <div className="quiz-header">
          <span className="quiz-level-badge">Level {level}</span>
          <span className="quiz-progress">
            Question {currentIndex + 1} / {questions.length}
          </span>
          <span className="quiz-score">Score: {score}</span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-wrapper">
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>

        {/* Timer */}
        <Timer duration={30} onTimeUp={handleTimeUp} resetKey={timerKey} />

        {/* Question */}
        <div className="question-card">
          <h2 className="question-text">{currentQuestion.question}</h2>

          {/* Options */}
          <div className="options-grid">
            {options.map((option, idx) => (
              <button
                key={idx}
                className={getOptionClass(option)}
                onClick={() => handleAnswer(option)}
                disabled={!!feedback}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                {option}
              </button>
            ))}
          </div>

          {/* Feedback section */}
          {feedback && (
            <div className={`feedback-box ${feedback.correct ? 'feedback-correct' : 'feedback-wrong'}`}>
              {feedback.correct ? (
                <div className="feedback-correct-msg">
                  <span className="feedback-icon">✅</span>
                  <strong>Correct! Well done!</strong>
                  <span className="credits-earned">+10 Credits</span>
                </div>
              ) : (
                <div className="feedback-wrong-msg">
                  <span className="feedback-icon">❌</span>
                  <strong>
                    {selectedAnswer === '__TIME_UP__' ? "Time's up!" : 'Wrong Answer!'}
                  </strong>
                  <div className="correct-answer-display">
                    ✅ Correct Answer: <strong>{feedback.correctAnswer}</strong>
                  </div>
                </div>
              )}
              {/* Explanation always shown */}
              <div className="explanation-box">
                <strong>📚 Explanation:</strong>
                <p>{feedback.explanation}</p>
              </div>
            </div>
          )}

          {/* Next button */}
          {feedback && (
            <button className="btn-next" onClick={handleNext}>
              {currentIndex + 1 >= questions.length ? 'See Results 🏆' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
