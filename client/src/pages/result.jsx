import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      }).catch(err => console.error("Error saving result", err));
    }
  }, [wpm, accuracy, timeTaken, language, difficulty, navigate]);

  if (wpm === undefined || accuracy === undefined) return null;

  return (
    <div className="page-container">

      {/* Top-left navigation */}
      <div style={{ position: 'fixed', top: '1.2rem', left: '1.2rem', display: 'flex', gap: '0.5rem', zIndex: 100 }}>
        <button
          onClick={() => navigate(-1)}
          title="Go Back"
          style={{ background: 'rgba(30,20,15,0.9)', border: '1px solid rgba(249,115,22,0.4)', color: 'white', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
        >
          &#8592;
        </button>
        <button
          onClick={() => navigate('/')}
          title="Go to Home"
          style={{ background: 'rgba(30,20,15,0.9)', border: '1px solid rgba(249,115,22,0.4)', color: 'white', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
        >
          🏠
        </button>
      </div>

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
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => navigate('/practice')}
            className="start-typing-btn"
            style={{ minWidth: '250px' }}
          >
            Try Again &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
