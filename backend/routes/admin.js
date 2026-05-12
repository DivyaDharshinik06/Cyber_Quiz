// routes/admin.js - Admin panel routes
const express = require('express');
const router = express.Router();
const pool = require('../db');
const adminAuth = require('../middleware/adminAuth');

// GET /api/admin/users — all users with performance stats
router.get('/users', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id, u.username, u.email, u.credits, u.current_level,
        u.levels_completed, u.award, u.is_admin, u.created_at,
        COUNT(p.id) AS total_attempts,
        COALESCE(SUM(p.score), 0) AS total_correct,
        COALESCE(SUM(p.total), 0) AS total_questions,
        COALESCE(ROUND(AVG(p.score::NUMERIC / NULLIF(p.total,0) * 100), 1), 0) AS avg_score_pct
      FROM users u
      LEFT JOIN progress p ON p.user_id = u.id
      WHERE u.is_admin = FALSE
      GROUP BY u.id
      ORDER BY u.credits DESC
    `);
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/admin/users/:id — single user full details + history
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const userResult = await pool.query(
      `SELECT id, username, email, credits, current_level, levels_completed, award, created_at
       FROM users WHERE id = $1`,
      [req.params.id]
    );
    if (userResult.rows.length === 0) return res.status(404).json({ message: 'User not found.' });

    const history = await pool.query(
      `SELECT level, score, total, credits_earned,
              ROUND(score::NUMERIC / NULLIF(total,0) * 100, 1) AS pct,
              completed_at
       FROM progress WHERE user_id = $1 ORDER BY completed_at DESC`,
      [req.params.id]
    );

    // Per-level best score
    const levelStats = await pool.query(
      `SELECT level,
              COUNT(*) AS attempts,
              MAX(score) AS best_score,
              MAX(total) AS total_q,
              ROUND(MAX(score::NUMERIC / NULLIF(total,0) * 100), 1) AS best_pct
       FROM progress WHERE user_id = $1 GROUP BY level ORDER BY level`,
      [req.params.id]
    );

    res.json({ user: userResult.rows[0], history: history.rows, levelStats: levelStats.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/admin/users/:id — delete a user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 AND is_admin = FALSE RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found or cannot delete admin.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/admin/users/:id/award — give award + optional bonus credits
router.patch('/users/:id/award', adminAuth, async (req, res) => {
  const { award, bonusCredits = 0 } = req.body;
  if (!award) return res.status(400).json({ message: 'Award name is required.' });
  try {
    const result = await pool.query(
      `UPDATE users SET award = $1, credits = credits + $2
       WHERE id = $3 AND is_admin = FALSE
       RETURNING id, username, award, credits`,
      [award, bonusCredits, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'Award granted!', user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

// PATCH /api/admin/users/:id/credits — manually adjust credits
router.patch('/users/:id/credits', adminAuth, async (req, res) => {
  const { credits } = req.body;
  if (credits === undefined) return res.status(400).json({ message: 'credits value required.' });
  try {
    const result = await pool.query(
      'UPDATE users SET credits = credits + $1 WHERE id = $2 AND is_admin = FALSE RETURNING id, username, credits',
      [credits, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'Credits updated.', user: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
