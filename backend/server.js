// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();

// Allow both local dev and deployed Vercel frontend
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    // Allow localhost and any vercel.app domain
    if (
      origin.includes('localhost') ||
      origin.includes('vercel.app') ||
      origin === process.env.FRONTEND_URL
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
