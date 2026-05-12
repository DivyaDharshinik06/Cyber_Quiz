// routes/quiz.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const MAX_LEVEL = 10;

router.get('/questions/:level', authMiddleware, async (req, res) => {
  const level = parseInt(req.params.level);
  if (level < 1 || level > MAX_LEVEL) {
    return res.status(400).json({ message: `Invalid level. Must be 1 to ${MAX_LEVEL}.` });
  }
  try {
    const userResult = await pool.query('SELECT current_level FROM users WHERE id = $1', [req.user.id]);
    if (level > userResult.rows[0].current_level) {
      return res.status(403).json({ message: 'Level not unlocked yet.' });
    }
    const result = await pool.query('SELECT * FROM questions WHERE level = $1 ORDER BY RANDOM()', [level]);
    res.json({ questions: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error fetching questions.' });
  }
});

router.post('/submit', authMiddleware, async (req, res) => {
  const { level, score, total } = req.body;
  if (!level || score === undefined || !total) {
    return res.status(400).json({ message: 'level, score, and total are required.' });
  }
  try {
    const creditsEarned = score * 10;
    const passed = score >= Math.ceil(total * 0.6);
    const userResult = await pool.query(
      'SELECT credits, current_level, levels_completed FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userResult.rows[0];
    let newLevel = user.current_level;
    let newLevelsCompleted = user.levels_completed;

    if (passed && level === user.current_level && level < MAX_LEVEL) {
      newLevel = user.current_level + 1;
    }
    if (passed && level > user.levels_completed) {
      newLevelsCompleted = level;
    }
    const newCredits = user.credits + creditsEarned;

    await pool.query(
      'UPDATE users SET credits = $1, current_level = $2, levels_completed = $3 WHERE id = $4',
      [newCredits, newLevel, newLevelsCompleted, req.user.id]
    );
    await pool.query(
      'INSERT INTO progress (user_id, level, score, total, credits_earned) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, level, score, total, creditsEarned]
    );

    res.json({
      passed, creditsEarned, newCredits, newLevel, newLevelsCompleted,
      message: passed
        ? `Level ${level} completed! You earned ${creditsEarned} credits.`
        : `You scored ${score}/${total}. You need 60% to pass. Try again!`,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error submitting results.' });
  }
});

module.exports = router;
