// pages/Result.js - Quiz result page with answer review
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Result = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // If accessed directly without state, redirect to dashboard
  if (!state) {
    navigate('/dashboard');
    return null;
  }

  const { level, score, total, passed, creditsEarned, newCredits, answers } = state;
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="page">
      <Navbar />
      <div className="result-container">
        {/* Result header */}
        <div className={`result-header ${passed ? 'result-pass' : 'result-fail'}`}>
          <div className="result-icon">{passed ? '🏆' : '😔'}</div>
          <h1>{passed ? 'Level Completed!' : 'Level Failed'}</h1>
          <p>{passed ? `You've unlocked Level ${level + 1}!` : 'You need 60% to pass. Keep practicing!'}</p>
        </div>

        {/* Score summary */}
        <div className="result-summary">
          <div className="result-stat">
            <span className="result-stat-value">{score}/{total}</span>
            <span className="result-stat-label">Correct Answers</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value">{percentage}%</span>
            <span className="result-stat-label">Score</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value">+{creditsEarned}</span>
            <span className="result-stat-label">Credits Earned</span>
          </div>
          <div className="result-stat">
            <span className="result-stat-value">{newCredits}</span>
            <span className="result-stat-label">Total Credits</span>
          </div>
        </div>

        {/* Score progress bar */}
        <div className="result-progress-wrapper">
          <div
            className="result-progress-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: percentage >= 60 ? '#00ff88' : '#ff4444',
            }}
          />
          <span className="result-progress-label">{percentage}%</span>
        </div>

        {/* Answer review */}
        <div className="answer-review">
          <h2>📋 Answer Review</h2>
          {answers && answers.map((a, idx) => (
            <div key={idx} className={`review-item ${a.isCorrect ? 'review-correct' : 'review-wrong'}`}>
              <div className="review-question">
                <span className="review-num">Q{idx + 1}.</span>
                <span>{a.question}</span>
                <span className="review-badge">{a.isCorrect ? '✅' : '❌'}</span>
              </div>
              {!a.isCorrect && (
                <div className="review-details">
                  <p>Your answer: <span className="wrong-text">{a.selected === '__TIME_UP__' ? "Time's up!" : a.selected}</span></p>
                  <p>Correct answer: <span className="correct-text">{a.correct}</span></p>
                  <div className="review-explanation">
                    <strong>📚 Explanation:</strong> {a.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="result-actions">
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
          <button className="btn-secondary" onClick={() => navigate(`/quiz/${level}`)}>
            Try Again
          </button>
          {passed && level < 10 && (
            <button className="btn-next-level" onClick={() => navigate(`/quiz/${level + 1}`)}>
              Next Level →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
