// components/Timer.js - Countdown timer for each question
import React, { useState, useEffect } from 'react';

const Timer = ({ duration = 30, onTimeUp, resetKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Reset timer when question changes (resetKey changes)
  useEffect(() => {
    setTimeLeft(duration);
  }, [resetKey, duration]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  // Color changes as time runs out
  const getColor = () => {
    if (timeLeft > 15) return '#00ff88';
    if (timeLeft > 7) return '#ffaa00';
    return '#ff4444';
  };

  const percentage = (timeLeft / duration) * 100;

  return (
    <div className="timer-container">
      <div className="timer-bar-wrapper">
        <div
          className="timer-bar"
          style={{ width: `${percentage}%`, backgroundColor: getColor() }}
        />
      </div>
      <span className="timer-text" style={{ color: getColor() }}>
        ⏱ {timeLeft}s
      </span>
    </div>
  );
};

export default Timer;
