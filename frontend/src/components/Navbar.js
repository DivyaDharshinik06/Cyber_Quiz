// components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">🛡️ CyberQuiz</Link>
      </div>
      {user && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          {user.is_admin && (
            <Link to="/admin" className="navbar-admin-link">⚙️ Admin</Link>
          )}
          <span className="navbar-credits">💰 {user.credits || 0} Credits</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
