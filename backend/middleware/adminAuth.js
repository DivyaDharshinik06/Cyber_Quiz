// middleware/adminAuth.js - Verifies user is an admin
const jwt = require('jsonwebtoken');
const pool = require('../db');

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Check is_admin flag from DB (don't trust token alone)
    const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [decoded.id]);
    if (!result.rows[0]?.is_admin) {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = adminAuth;
