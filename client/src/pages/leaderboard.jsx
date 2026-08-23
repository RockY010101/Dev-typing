import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Leaderboard.css';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const LANG_DISPLAY = {
  js: 'JavaScript',
  py: 'Python',
  java: 'Java',
  cpp: 'C++',
  html: 'HTML',
  css: 'CSS',
  JavaScript: 'JavaScript',
  Python: 'Python',
  Java: 'Java',
  'C++': 'C++',
  HTML: 'HTML',
  CSS: 'CSS',
};

function rankClass(rank) {
  if (rank === 1) return 'rank-1';
  if (rank === 2) return 'rank-2';
  if (rank === 3) return 'rank-3';
  return '';
}

function rankBadgeClass(rank) {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return 'normal';
}

function rankLabel(rank) {
  if (rank === 1) return '🥇 #01';
  if (rank === 2) return '🥈 #02';
  if (rank === 3) return '🥉 #03';
  return `#${String(rank).padStart(2, '0')}`;
}

function formatTime(seconds) {
  if (seconds === undefined || seconds === null) return '--';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`;
  return `${s}s`;
}

function Avatar({ picture, username }) {
  if (picture) {
    return <img src={picture} alt={username} className="lb-avatar" />;
  }
  return (
    <div className="lb-avatar-placeholder">
      {username ? username[0].toUpperCase() : '?'}
    </div>
  );
}

function LeaderboardRow({ entry, isCurrentUser }) {
  return (
    <div className={`lb-row ${rankClass(entry.rank)} ${isCurrentUser ? 'lb-your-rank-row' : ''}`}>
      <span className={`lb-rank ${rankBadgeClass(entry.rank)}`}>
        {rankLabel(entry.rank)}
      </span>
      <Avatar picture={entry.picture} username={entry.username} />
      <span className="lb-username">{entry.username}</span>
      <span className="lb-lang">{LANG_DISPLAY[entry.language] || entry.language}</span>
      <span className="lb-wpm">{entry.wpm} WPM</span>
      <span className="lb-time">{formatTime(entry.timeTaken)}</span>
    </div>
  );
}

function Leaderboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Pre-select difficulty from query param (e.g. coming from result page)
  const initialDiff = DIFFICULTIES.includes(searchParams.get('difficulty'))
    ? searchParams.get('difficulty')
    : 'easy';

  const [activeDiff, setActiveDiff] = useState(initialDiff);
  const [top10, setTop10] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = (() => {
    try {
      const dbUser = localStorage.getItem('dbUser');
      return dbUser ? JSON.parse(dbUser)._id : null;
    } catch { return null; }
  })();

  const fetchLeaderboard = useCallback(async (diff) => {
    setLoading(true);
    setError(null);
    try {
      const params = { difficulty: diff };
      if (currentUserId) params.userId = currentUserId;
      const { data } = await axios.get('/api/results/leaderboard', { params });
      setTop10(data.top10 || []);
      setUserRank(data.userRank || null);
    } catch (err) {
      setError('Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchLeaderboard(activeDiff);
  }, [activeDiff, fetchLeaderboard]);

  // Is current user already in top 10?
  const currentUserInTop10 = top10.some(e => e.userId?.toString() === currentUserId);

  function tabActiveClass(diff) {
    if (activeDiff !== diff) return '';
    if (diff === 'easy') return 'active-easy';
    if (diff === 'medium') return 'active-medium';
    return 'active-hard';
  }

  return (
    <div className="leaderboard-page">
      <h1 className="leaderboard-title">LEADERBOARD</h1>

      {/* Difficulty tabs */}
      <div className="lb-tabs">
        {DIFFICULTIES.map(diff => (
          <button
            key={diff}
            className={`lb-tab ${tabActiveClass(diff)}`}
            onClick={() => setActiveDiff(diff)}
          >
            {diff.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="lb-table-wrap">
        {/* Column headers */}
        <div className="lb-col-header">
          <span>RANK</span>
          <span></span>
          <span>PLAYER</span>
          <span style={{ textAlign: 'center' }}>LANGUAGE</span>
          <span style={{ textAlign: 'center' }}>WPM</span>
          <span style={{ textAlign: 'center' }}>TIME</span>
        </div>

        {loading && (
          <div className="lb-status">Loading...</div>
        )}

        {!loading && error && (
          <div className="lb-status">{error}</div>
        )}

        {!loading && !error && top10.length === 0 && (
          <div className="lb-status">No results yet. Be the first!</div>
        )}

        {!loading && !error && top10.map(entry => (
          <LeaderboardRow
            key={entry.userId}
            entry={entry}
            isCurrentUser={entry.userId?.toString() === currentUserId}
          />
        ))}
      </div>

      {/* Your rank (only if outside top 10) */}
      {!loading && !error && !currentUserInTop10 && (
        <div className="lb-your-rank-wrap">
          <div className="lb-your-rank-label">— YOUR RANK —</div>
          {userRank ? (
            <LeaderboardRow entry={userRank} isCurrentUser />
          ) : (
            <div className="lb-status" style={{ padding: '1rem', textAlign: 'left' }}>
              Complete a test with ≥90% accuracy to get your ranking.
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          className="start-button"
          onClick={() => navigate('/practice')}
        >
          Play Again →
        </button>
      </div>
    </div>
  );
}

export default Leaderboard;
