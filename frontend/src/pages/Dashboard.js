// pages/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const levels = [
  { level: 1,  title: 'Level 1: Beginner',         description: 'Basic cyber awareness — passwords, phishing, malware',              icon: '🟢', color: '#00ff88' },
  { level: 2,  title: 'Level 2: Intermediate',      description: 'Network & web security — SQL injection, VPN, XSS',                  icon: '🟡', color: '#ffaa00' },
  { level: 3,  title: 'Level 3: Advanced',           description: 'Advanced threats — botnets, encryption, OWASP',                     icon: '🔴', color: '#ff4444' },
  { level: 4,  title: 'Level 4: Forensics',          description: 'Cyber forensics & incident response — IoC, DFIR, honeypots',        icon: '🔵', color: '#00aaff' },
  { level: 5,  title: 'Level 5: Expert',             description: 'Cloud & modern security — Zero Trust, DevSecOps, WAF',              icon: '🟣', color: '#cc44ff' },
  { level: 6,  title: 'Level 6: Mobile Security',    description: 'Mobile threats — MDM, smishing, juice jacking, app permissions',    icon: '📱', color: '#ff8800' },
  { level: 7,  title: 'Level 7: Malware Analysis',   description: 'Malware types & analysis — rootkits, trojans, C2, obfuscation',    icon: '🦠', color: '#ff44aa' },
  { level: 8,  title: 'Level 8: Cryptography',       description: 'Crypto deep dive — PKI, hashing, PFS, quantum cryptography',       icon: '🔐', color: '#44ffdd' },
  { level: 9,  title: 'Level 9: Ethical Hacking',    description: 'Pen testing — recon, Metasploit, MITRE ATT&CK, fuzzing',           icon: '🎯', color: '#ffdd00' },
  { level: 10, title: 'Level 10: Cyber Law',         description: 'Compliance & privacy — GDPR, HIPAA, PCI DSS, ISO 27001',           icon: '⚖️', color: '#aaaaff' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentLevel = user?.current_level || 1;
  const levelsCompleted = user?.levels_completed || 0;

  return (
    <div className="page">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-welcome">
          <h1>Welcome back, <span className="highlight">{user?.username}</span>! 👋</h1>
          <p>Choose a level to start your cybersecurity challenge</p>
          {user?.award && (
            <div className="award-banner">🏅 Award: <strong>{user.award}</strong></div>
          )}
          <div className="stats-row">
            <div className="stat-card">
              <span className="stat-value">💰 {user?.credits || 0}</span>
              <span className="stat-label">Total Credits</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">🏆 {levelsCompleted}/10</span>
              <span className="stat-label">Levels Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">🔓 Level {currentLevel}</span>
              <span className="stat-label">Current Unlock</span>
            </div>
          </div>
        </div>

        <div className="levels-grid">
          {levels.map(({ level, title, description, icon, color }) => {
            const unlocked = level <= currentLevel;
            const completed = level <= levelsCompleted;
            return (
              <div
                key={level}
                className={`level-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                style={{ borderColor: unlocked ? color : '#333' }}
              >
                <div className="level-icon">{unlocked ? icon : '🔒'}</div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="level-meta">
                  <span>10 Questions</span>
                  <span>10 Credits each</span>
                </div>
                {completed && <div className="completed-badge">✅ Completed</div>}
                <button
                  className="btn-level"
                  style={{ backgroundColor: unlocked ? color : '#555', color: unlocked ? '#000' : '#888' }}
                  disabled={!unlocked}
                  onClick={() => navigate(`/quiz/${level}`)}
                >
                  {unlocked ? (completed ? 'Play Again' : 'Start Level') : 'Locked 🔒'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
