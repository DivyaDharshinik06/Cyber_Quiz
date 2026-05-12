// pages/Profile.js
import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data.user);
        setHistory(res.data.history);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="loading-screen">Loading profile... 🔄</div>;

  const data = profile || user;
  const overallProgress = ((data?.levels_completed || 0) / 10) * 100;

  return (
    <div className="page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{data?.username?.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <h1>{data?.username}</h1>
            <p>{data?.email}</p>
            <p className="profile-joined">Joined: {new Date(data?.created_at).toLocaleDateString()}</p>
            {data?.award && <div className="award-banner">🏅 Award: <strong>{data.award}</strong></div>}
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat-card">
            <span className="profile-stat-icon">💰</span>
            <span className="profile-stat-value">{data?.credits || 0}</span>
            <span className="profile-stat-label">Total Credits</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-icon">🏆</span>
            <span className="profile-stat-value">{data?.levels_completed || 0}/10</span>
            <span className="profile-stat-label">Levels Completed</span>
          </div>
          <div className="profile-stat-card">
            <span className="profile-stat-icon">🔓</span>
            <span className="profile-stat-value">Level {data?.current_level || 1}</span>
            <span className="profile-stat-label">Current Level</span>
          </div>
        </div>

        <div className="profile-progress-section">
          <h3>Overall Progress</h3>
          <div className="progress-bar-wrapper large">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <p>{data?.levels_completed || 0} of 10 levels completed ({Math.round(overallProgress)}%)</p>
        </div>

        <div className="level-progress-grid ten-col">
          {[1,2,3,4,5,6,7,8,9,10].map((lvl) => {
            const completed = lvl <= (data?.levels_completed || 0);
            const unlocked = lvl <= (data?.current_level || 1);
            return (
              <div key={lvl} className={`level-progress-item ${completed ? 'done' : unlocked ? 'unlocked' : 'locked'}`}>
                <span>{completed ? '✅' : unlocked ? '🔓' : '🔒'}</span>
                <span>Lvl {lvl}</span>
                <span>{completed ? 'Done' : unlocked ? 'Open' : 'Locked'}</span>
              </div>
            );
          })}
        </div>

        <div className="history-section">
          <h3>📜 Recent Quiz History</h3>
          {history.length === 0 ? (
            <p className="no-history">No quiz attempts yet. Start playing!</p>
          ) : (
            <div className="history-list">
              {history.map((h, idx) => (
                <div key={idx} className="history-item">
                  <span className="history-level">Level {h.level}</span>
                  <span className="history-score">{h.score}/{h.total}</span>
                  <span className="history-credits">+{h.credits_earned} credits</span>
                  <span className="history-date">{new Date(h.completed_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
