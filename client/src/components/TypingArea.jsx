import React, { useState, useEffect, useRef } from 'react';

const jsEasySnippets = [
  "const message = 'Hello, World!';\nconsole.log(message);",
  "function add(a, b) {\n  return a + b;\n}",
  "let count = 0;\ncount += 1;",
  "const items = [1, 2, 3];\nitems.forEach(item => {\n  console.log(item);\n});"
];

const jsMediumSnippets = [
  "const numbers = [1, 2, 3, 4, 5];\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log(evens);",
  "async function fetchData(url) {\n  const response = await fetch(url);\n  return await response.json();\n}",
  "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    console.log(`${this.name} makes a noise.`);\n  }\n}"
];

const jsHardSnippets = [
  "function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}",
  "const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};"
];

function TypingArea({ language, difficulty, onGoBack }) {
  const [snippet, setSnippet] = useState('');
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (language === 'js') {
      let snippets = [];
      if (difficulty === 'easy') snippets = jsEasySnippets;
      else if (difficulty === 'medium') snippets = jsMediumSnippets;
      else if (difficulty === 'hard') snippets = jsHardSnippets;
      
      if (snippets.length > 0) {
        const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
        setSnippet(randomSnippet);
      } else {
        setSnippet(`// Snippets for ${language} - ${difficulty} coming soon!\n// Try JavaScript Easy for now.`);
      }
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
