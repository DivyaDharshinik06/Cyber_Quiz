// routes/user.js - User profile and leaderboard
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// ─── GET /api/user/profile ─────────────────────────────────────────────────
// Get current user's profile data
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, username, email, credits, current_level, levels_completed, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get quiz history
    const history = await pool.query(
      `SELECT level, score, total, credits_earned, completed_at
       FROM progress WHERE user_id = $1
       ORDER BY completed_at DESC LIMIT 10`,
      [req.user.id]
    );

    res.json({ user: result.rows[0], history: history.rows });
  } catch (err) {
    console.error('Profile error:', err.message);
    res.status(500).json({ message: 'Server error fetching profile.' });
  }
});

// ─── GET /api/user/leaderboard ─────────────────────────────────────────────
// Get top 10 users by credits
router.get('/leaderboard', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT username, credits, levels_completed
       FROM users
       ORDER BY credits DESC, levels_completed DESC
       LIMIT 10`
    );
    res.json({ leaderboard: result.rows });
  } catch (err) {
    console.error('Leaderboard error:', err.message);
    res.status(500).json({ message: 'Server error fetching leaderboard.' });
  }
});

module.exports = router;
