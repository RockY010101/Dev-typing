import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaJs, FaPython, FaJava } from 'react-icons/fa6';
import { SiCplusplus } from 'react-icons/si';

function Practice() {
  const [selectedLang, setSelectedLang] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState(null);
  const navigate = useNavigate();

  const languages = [
    { id: 'js', name: 'JavaScript', color: '#facc15', Icon: FaJs },
    { id: 'py', name: 'Python', color: '#10b981', Icon: FaPython },
    { id: 'java', name: 'Java', color: '#ea580c', Icon: FaJava },
    { id: 'cpp', name: 'C++', color: '#6366f1', Icon: SiCplusplus }
  ];

  const difficulties = [
    { id: 'easy', name: 'Easy', desc: 'Short snippets, basic syntax', colorClass: 'text-easy' },
    { id: 'medium', name: 'Medium', desc: 'Functions, loops, and logic', colorClass: 'text-medium' },
    { id: 'hard', name: 'Hard', desc: 'Complex patterns & algorithms', colorClass: 'text-hard' }
  ];

  const isStartEnabled = selectedLang !== null && selectedDiff !== null;

  const handleStartTyping = () => {
    navigate('/typing', { state: { language: selectedLang, difficulty: selectedDiff } });
  };

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

      <div className="practice-card">
        <div className="practice-header">
          <h1 className="practice-title">DevType</h1>
          <p className="practice-subtitle">Type real code. Build real speed.</p>
        </div>

        <div className="practice-section">
          <h2 className="section-title">LANGUAGE</h2>
          <div className="options-group">
            {languages.map((lang) => (
              <button 
                key={lang.id}
                className={`lang-btn ${selectedLang === lang.id ? 'active' : ''}`}
                onClick={() => setSelectedLang(lang.id)}
              >
                <lang.Icon 
                  className="lang-icon" 
                  style={{ color: lang.color }}
                />
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        <div className="practice-section">
          <h2 className="section-title">DIFFICULTY</h2>
          <div className="options-group difficulty-group">
            {difficulties.map((diff) => (
              <button 
                key={diff.id}
                className={`diff-btn ${selectedDiff === diff.id ? 'active' : ''}`}
                onClick={() => setSelectedDiff(diff.id)}
              >
                <div className={`diff-title ${diff.colorClass}`}>{diff.name}</div>
                <div className="diff-desc">{diff.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <button 
          className="start-typing-btn"
          disabled={!isStartEnabled}
          onClick={handleStartTyping}
        >
          Start Typing &rarr;
        </button>
      </div>
    </div>
  );
}

export default Practice;