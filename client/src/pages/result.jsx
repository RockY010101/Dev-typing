import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const { wpm, accuracy } = location.state || {};

  useEffect(() => {
    // If accessed directly without state, redirect to practice
    if (wpm === undefined || accuracy === undefined) {
      navigate('/practice', { replace: true });
    }
  }, [wpm, accuracy, navigate]);

  if (wpm === undefined || accuracy === undefined) return null;

  return (
    <div className="page-container">
      <div className="flex flex-col items-center justify-center text-white py-12">
        <h2 style={{ fontFamily: '"Press Start 2P", monospace', textAlign: 'center', color: 'white', fontSize: '2rem', marginBottom: '3rem' }}>Test Complete!</h2>
        <div className="flex justify-center gap-12 mb-12" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'rgba(30, 20, 15, 0.95)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '2rem', borderRadius: '24px', width: '200px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{wpm}</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif', fontWeight: 'bold' }}>WPM</div>
          </div>
          <div style={{ backgroundColor: 'rgba(30, 20, 15, 0.95)', border: '1px solid rgba(249, 115, 22, 0.25)', padding: '2rem', borderRadius: '24px', width: '200px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#facc15', marginBottom: '0.5rem', fontFamily: 'monospace' }}>{accuracy}%</div>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Accuracy</div>
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
