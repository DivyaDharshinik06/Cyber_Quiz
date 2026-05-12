// pages/AdminPanel.js
import React, { useState, useEffect, useCallback } from 'react';
import { adminGetUsers, adminGetUser, adminDeleteUser, adminGiveAward, adminAdjustCredits } from '../services/api';
import Navbar from '../components/Navbar';

const AWARDS = [
  { label: '🥇 Cyber Champion', value: 'Cyber Champion' },
  { label: '🛡️ Security Expert', value: 'Security Expert' },
  { label: '🔥 Top Performer', value: 'Top Performer' },
  { label: '⭐ Rising Star', value: 'Rising Star' },
  { label: '🎓 Quiz Master', value: 'Quiz Master' },
  { label: '💎 Elite Hacker', value: 'Elite Hacker' },
];

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [awardValue, setAwardValue] = useState('');
  const [bonusCredits, setBonusCredits] = useState(0);
  const [adjustCredits, setAdjustCredits] = useState(0);
  const [toast, setToast] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminGetUsers();
      setUsers(res.data.users);
    } catch (err) {
      showToast('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openDetail = async (user) => {
    setSelectedUser(user);
    setDetailLoading(true);
    setAwardValue(user.award || '');
    setBonusCredits(0);
    setAdjustCredits(0);
    try {
      const res = await adminGetUser(user.id);
      setUserDetail(res.data);
    } catch (err) {
      showToast('Failed to load user details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedUser(null);
    setUserDetail(null);
  };

  const handleDelete = async (id) => {
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      closeDetail();
      setConfirmDelete(null);
      showToast('✅ User deleted successfully.');
    } catch (err) {
      showToast('Failed to delete user.');
    }
  };

  const handleGiveAward = async () => {
    if (!awardValue) return showToast('Please select an award.');
    try {
      await adminGiveAward(selectedUser.id, { award: awardValue, bonusCredits: parseInt(bonusCredits) || 0 });
      showToast(`🏅 Award "${awardValue}" given to ${selectedUser.username}!`);
      fetchUsers();
      closeDetail();
    } catch (err) {
      showToast('Failed to give award.');
    }
  };

  const handleAdjustCredits = async () => {
    try {
      await adminAdjustCredits(selectedUser.id, { credits: parseInt(adjustCredits) || 0 });
      showToast(`💰 Credits updated for ${selectedUser.username}.`);
      fetchUsers();
      closeDetail();
    } catch (err) {
      showToast('Failed to adjust credits.');
    }
  };

  const getPerformanceBadge = (pct) => {
    const p = parseFloat(pct);
    if (p >= 90) return { label: 'Excellent', color: '#00ff88' };
    if (p >= 70) return { label: 'Good', color: '#ffaa00' };
    if (p >= 50) return { label: 'Average', color: '#00aaff' };
    return { label: 'Needs Work', color: '#ff4444' };
  };

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Navbar />
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1>⚙️ Admin Panel</h1>
            <p>Manage users, view performance, and give awards</p>
          </div>
          <div className="admin-summary-badges">
            <span className="admin-badge">👥 {users.length} Users</span>
            <span className="admin-badge">💰 {users.reduce((a, u) => a + parseInt(u.credits), 0)} Total Credits</span>
          </div>
        </div>

        {/* Search */}
        <div className="admin-search-row">
          <input
            className="admin-search"
            placeholder="🔍 Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="loading-screen">Loading users... 🔄</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Credits</th>
                  <th>Levels Done</th>
                  <th>Attempts</th>
                  <th>Avg Score</th>
                  <th>Award</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, idx) => {
                  const badge = getPerformanceBadge(u.avg_score_pct);
                  return (
                    <tr key={u.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{u.username}</strong></td>
                      <td className="admin-email">{u.email}</td>
                      <td><span className="admin-credits-val">💰 {u.credits}</span></td>
                      <td>{'⭐'.repeat(u.levels_completed || 0)} {u.levels_completed}/5</td>
                      <td>{u.total_attempts}</td>
                      <td>
                        <span className="perf-badge" style={{ color: badge.color, borderColor: badge.color }}>
                          {u.avg_score_pct}% — {badge.label}
                        </span>
                      </td>
                      <td>{u.award ? <span className="award-tag">🏅 {u.award}</span> : <span className="no-award">—</span>}</td>
                      <td>
                        <div className="admin-action-btns">
                          <button className="btn-view" onClick={() => openDetail(u)}>View</button>
                          <button className="btn-del" onClick={() => setConfirmDelete(u)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{confirmDelete.username}</strong>? This cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-confirm-del" onClick={() => handleDelete(confirmDelete.id)}>Delete User</button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-box modal-large" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetail}>✕</button>
            <h2>👤 {selectedUser.username}</h2>
            <p className="modal-email">{selectedUser.email}</p>

            {detailLoading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading details...</div>
            ) : userDetail && (
              <>
                {/* Stats row */}
                <div className="detail-stats">
                  <div className="detail-stat">
                    <span>💰</span><strong>{userDetail.user.credits}</strong><small>Credits</small>
                  </div>
                  <div className="detail-stat">
                    <span>🏆</span><strong>{userDetail.user.levels_completed}/5</strong><small>Levels Done</small>
                  </div>
                  <div className="detail-stat">
                    <span>🔓</span><strong>Level {userDetail.user.current_level}</strong><small>Unlocked</small>
                  </div>
                  <div className="detail-stat">
                    <span>📅</span><strong>{new Date(userDetail.user.created_at).toLocaleDateString()}</strong><small>Joined</small>
                  </div>
                </div>

                {/* Per-level performance */}
                {userDetail.levelStats.length > 0 && (
                  <div className="detail-section">
                    <h4>📊 Performance by Level</h4>
                    <div className="level-stats-grid">
                      {userDetail.levelStats.map((ls) => (
                        <div key={ls.level} className="level-stat-card">
                          <span className="ls-level">Level {ls.level}</span>
                          <span className="ls-best">{ls.best_score}/{ls.total_q}</span>
                          <span className="ls-pct" style={{ color: getPerformanceBadge(ls.best_pct).color }}>
                            {ls.best_pct}%
                          </span>
                          <span className="ls-attempts">{ls.attempts} attempt{ls.attempts > 1 ? 's' : ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent history */}
                {userDetail.history.length > 0 && (
                  <div className="detail-section">
                    <h4>📜 Recent Attempts</h4>
                    <div className="detail-history">
                      {userDetail.history.slice(0, 6).map((h, i) => (
                        <div key={i} className="detail-history-item">
                          <span>Level {h.level}</span>
                          <span>{h.score}/{h.total}</span>
                          <span style={{ color: getPerformanceBadge(h.pct).color }}>{h.pct}%</span>
                          <span>+{h.credits_earned} cr</span>
                          <span>{new Date(h.completed_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Give Award */}
                <div className="detail-section">
                  <h4>🏅 Give Award</h4>
                  {userDetail.user.award && (
                    <p style={{ color: 'var(--accent-yellow)', marginBottom: '0.5rem' }}>
                      Current award: <strong>{userDetail.user.award}</strong>
                    </p>
                  )}
                  <div className="award-form">
                    <select value={awardValue} onChange={(e) => setAwardValue(e.target.value)} className="admin-select">
                      <option value="">Select an award...</option>
                      {AWARDS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      className="admin-input-sm"
                      placeholder="Bonus credits"
                      value={bonusCredits}
                      onChange={(e) => setBonusCredits(e.target.value)}
                    />
                    <button className="btn-award" onClick={handleGiveAward}>Give Award</button>
                  </div>
                </div>

                {/* Adjust Credits */}
                <div className="detail-section">
                  <h4>💰 Adjust Credits</h4>
                  <div className="award-form">
                    <input
                      type="number"
                      className="admin-input-sm"
                      placeholder="Amount (use negative to deduct)"
                      value={adjustCredits}
                      onChange={(e) => setAdjustCredits(e.target.value)}
                    />
                    <button className="btn-credits" onClick={handleAdjustCredits}>Apply</button>
                  </div>
                </div>

                {/* Delete */}
                <div className="detail-section">
                  <button className="btn-confirm-del" style={{ width: '100%' }} onClick={() => { closeDetail(); setConfirmDelete(selectedUser); }}>
                    🗑️ Delete This User
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
