import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TypingArea from '../components/TypingArea';

function Typing() {
  const location = useLocation();
  const navigate = useNavigate();

  const { language, difficulty } = location.state || {};

  useEffect(() => {
    // If accessed directly without state, redirect to practice
    if (!language || !difficulty) {
      navigate('/practice', { replace: true });
    }
  }, [language, difficulty, navigate]);

  const handleComplete = (metrics) => {
    navigate('/result', { state: { wpm: metrics.wpm, accuracy: metrics.accuracy, timeTaken: metrics.timeTaken, language, difficulty }, replace: true });
  };

  const handleGoBack = () => {
    navigate('/practice');
  };

  if (!language || !difficulty) return null;

  return (
    <div className="page-container" style={{ width: '100%' }}>
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={handleGoBack} className="go-back-btn">
            &larr; ABORT
          </button>
        </div>
        <TypingArea 
          language={language} 
          difficulty={difficulty} 
          onComplete={handleComplete} 
        />
      </div>
    </div>
  );
}

export default Typing;
