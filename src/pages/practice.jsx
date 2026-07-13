import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TypingArea from '../components/TypingArea';
import { FaJs, FaPython, FaJava } from 'react-icons/fa6';
import { SiCplusplus } from 'react-icons/si';

function practice() {
  const [selectedLang, setSelectedLang] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState(null);
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Disable scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

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

  return (
    <div className="practice-modal-overlay" onClick={handleClose}>
      <div className="practice-card modal-animate" onClick={(e) => e.stopPropagation()}>
        {isTypingStarted ? (
          <TypingArea 
            language={selectedLang} 
            difficulty={selectedDiff} 
            onGoBack={() => setIsTypingStarted(false)} 
          />
        ) : (
          <>
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
          onClick={() => setIsTypingStarted(true)}
        >
          Start Typing &rarr;
        </button>
          </>
        )}
      </div>
    </div>
  );
}

export default practice;