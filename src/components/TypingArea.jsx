import React, { useState, useEffect, useRef } from 'react';

const jsEasySnippets = [
  "const message = 'Hello, World!';\nconsole.log(message);",
  "function add(a, b) {\n  return a + b;\n}",
  "let count = 0;\ncount += 1;",
  "const items = [1, 2, 3];\nitems.forEach(item => {\n  console.log(item);\n});"
];

function TypingArea({ language, difficulty, onGoBack }) {
  const [snippet, setSnippet] = useState('');
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Only JS Easy is currently implemented
    if (language === 'js' && difficulty === 'easy') {
      const randomSnippet = jsEasySnippets[Math.floor(Math.random() * jsEasySnippets.length)];
      setSnippet(randomSnippet);
    } else {
      setSnippet(`// Snippets for ${language} - ${difficulty} coming soon!\n// Try JavaScript Easy for now.`);
    }
    // Reset user input when changing snippet
    setUserInput('');
  }, [language, difficulty]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [snippet]);

  const handleInputChange = (e) => {
    // Prevent typing beyond the snippet length
    if (e.target.value.length <= snippet.length) {
      setUserInput(e.target.value);
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderSnippet = () => {
    return snippet.split('').map((char, index) => {
      let colorClass = 'typing-char-untyped';
      if (index < userInput.length) {
        if (userInput[index] === char) {
          colorClass = 'typing-char-correct';
        } else {
          colorClass = 'typing-char-incorrect';
        }
      } else if (index === userInput.length) {
        colorClass = 'typing-char-cursor';
      }
      return (
        <span key={index} className={`typing-char ${colorClass}`}>
          {char === '\n' && index === userInput.length ? '↵\n' : char}
        </span>
      );
    });
  };

  return (
    <div className="typing-area-wrapper" onClick={handleContainerClick}>
      <div className="typing-area-header">
        <button onClick={onGoBack} className="go-back-btn">&larr; BACK</button>
        <div className="typing-stats">
          <span>{Math.round((userInput.length / snippet.length) * 100 || 0)}%</span>
        </div>
      </div>
      
      <div className="typing-code-display">
        {renderSnippet()}
      </div>

      <textarea
        ref={inputRef}
        className="typing-hidden-input"
        value={userInput}
        onChange={handleInputChange}
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}

export default TypingArea;
