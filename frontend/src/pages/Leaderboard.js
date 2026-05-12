// pages/Leaderboard.js - Top players leaderboard
import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await getLeaderboard();
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  if (loading) return <div className="loading-screen">Loading leaderboard... 🔄</div>;

  return (
    <div className="page">
      <Navbar />
      <div className="leaderboard-container">
        <h1>🏆 Leaderboard</h1>
        <p>Top cybersecurity champions</p>

        {leaderboard.length === 0 ? (
          <p className="no-data">No players yet. Be the first!</p>
        ) : (
          <div className="leaderboard-list">
            {leaderboard.map((player, idx) => (
              <div
                key={idx}
                className={`leaderboard-item ${player.username === user?.username ? 'current-user' : ''}`}
              >
                <span className="leaderboard-rank">
                  {idx < 3 ? medals[idx] : `#${idx + 1}`}
                </span>
                <span className="leaderboard-username">
                  {player.username}
                  {player.username === user?.username && <span className="you-badge"> (You)</span>}
                </span>
                <span className="leaderboard-levels">
                  {'⭐'.repeat(Math.min(player.levels_completed || 0, 10))} {player.levels_completed}/10 levels
                </span>
                <span className="leaderboard-credits">💰 {player.credits}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
