# 🛡️ Cyber Awareness Quiz Game

A full-stack cybersecurity quiz game with level-based progression, JWT authentication, and educational explanations.

## Tech Stack
- **Frontend**: React.js, React Router, Axios, CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Auth**: JWT + bcrypt

## Project Structure
```
cyber_quiz/
├── database.sql              # PostgreSQL schema + seed data (30 questions)
├── backend/
│   ├── server.js             # Express entry point
│   ├── db.js                 # PostgreSQL connection
│   ├── .env                  # Environment variables
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   └── routes/
│       ├── auth.js           # Register / Login
│       ├── quiz.js           # Questions / Submit
│       └── user.js           # Profile / Leaderboard
└── frontend/
    └── src/
        ├── App.js            # Routes
        ├── App.css           # All styles
        ├── context/
        │   └── AuthContext.js
        ├── services/
        │   └── api.js        # Axios API calls
        ├── components/
        │   ├── Navbar.js
        │   ├── ProtectedRoute.js
        │   └── Timer.js
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js
            ├── Quiz.js
            ├── Result.js
            ├── Profile.js
            └── Leaderboard.js
```

## Setup Instructions

### 1. PostgreSQL Database
```sql
-- In psql or pgAdmin:
CREATE DATABASE cyber_quiz;
\c cyber_quiz
-- Then run the full database.sql file
\i path/to/database.sql
```

### 2. Backend Setup
```bash
cd backend

# Edit .env with your PostgreSQL credentials:
# DB_PASSWORD=your_actual_password

npm start
# Server runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/quiz/questions/:level | Yes | Get questions for level |
| POST | /api/quiz/submit | Yes | Submit quiz results |
| GET | /api/user/profile | Yes | Get user profile + history |
| GET | /api/user/leaderboard | Yes | Top 10 players |

## Game Rules
- **Level 1** (Beginner): Basic cyber awareness — unlocked by default
- **Level 2** (Intermediate): Network & web security — unlocked after passing Level 1
- **Level 3** (Advanced): Advanced threats — unlocked after passing Level 2
- **Passing score**: 60% (6/10 correct)
- **Credits**: +10 per correct answer
- **Wrong answers**: Show correct answer + detailed explanation
