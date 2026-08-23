import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasSaved = useRef(false);

  const { wpm, accuracy, timeTaken, language, difficulty } = location.state || {};

  useEffect(() => {
    // If accessed directly without state, redirect to practice
    if (wpm === undefined || accuracy === undefined) {
      navigate('/practice', { replace: true });
      return;
    }

    if (hasSaved.current) return;

    const savedDbUser = localStorage.getItem('dbUser');
    if (savedDbUser) {
      hasSaved.current = true;
      const user = JSON.parse(savedDbUser);
      axios.post('/api/results', {
        userId: user._id,
        wpm,
        accuracy,
        timeTaken,
        language: language || 'JavaScript',
        difficulty: difficulty || 'easy'
      }).catch(err => toast.error("Error saving result: " + (err.response?.data?.message || err.message)));
    }
  }, [wpm, accuracy, timeTaken, language, difficulty, navigate]);

  if (wpm === undefined || accuracy === undefined) return null;

  return (
    <div className="page-container">

      <div className="flex flex-col items-center justify-center text-white py-12">
        <h2 style={{ fontFamily: '"Press Start 2P", monospace', textAlign: 'center', color: 'white', fontSize: '2rem', marginBottom: '3rem' }}>Test Complete!</h2>
        <div className="flex justify-center gap-12 mb-12" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'rgba(30, 20, 15, 0.95)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '2rem', borderRadius: '24px', width: '240px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{wpm}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif', fontWeight: 'bold' }}>WPM</div>
          </div>
          <div style={{ backgroundColor: 'rgba(30, 20, 15, 0.95)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '2rem', borderRadius: '24px', width: '240px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#facc15', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{accuracy}%</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Accuracy</div>
          </div>
          <div style={{ backgroundColor: 'rgba(30, 20, 15, 0.95)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '2rem', borderRadius: '24px', width: '240px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#34d399', marginBottom: '0.5rem', fontFamily: 'monospace' }}>
              {String(Math.floor((timeTaken || 0) / 60)).padStart(2, '0')}:{String((timeTaken || 0) % 60).padStart(2, '0')}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Time</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/practice')}
            className="start-typing-btn"
            style={{ minWidth: '220px' }}
          >
            Try Again &rarr;
          </button>
          <button
            onClick={() => navigate(`/leaderboard?difficulty=${difficulty || 'easy'}`)}
            className="start-typing-btn"
            style={{ minWidth: '220px', background: 'linear-gradient(to right, #1d4ed8, #7c3aed)' }}
          >
            Leaderboard &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
