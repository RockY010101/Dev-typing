import React, { useState, useEffect, useRef } from 'react';

const snippetsData = {
  js: {
    easy: [
      "const message = 'Hello, World!';\nconsole.log(message);",
      "function add(a, b) {\n  return a + b;\n}",
      "let count = 0;\ncount += 1;",
      "const items = [1, 2, 3];\nitems.forEach(item => {\n  console.log(item);\n});"
    ],
    medium: [
      "const numbers = [1, 2, 3, 4, 5];\nconst evens = numbers.filter(n => n % 2 === 0);\nconsole.log(evens);",
      "async function fetchData(url) {\n  const response = await fetch(url);\n  return await response.json();\n}",
      "class Animal {\n  constructor(name) {\n    this.name = name;\n  }\n  speak() {\n    console.log(`${this.name} makes a noise.`);\n  }\n}"
    ],
    hard: [
      "function debounce(func, wait) {\n  let timeout;\n  return function executedFunction(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}",
      "const memoize = (fn) => {\n  const cache = new Map();\n  return (...args) => {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) return cache.get(key);\n    const result = fn(...args);\n    cache.set(key, result);\n    return result;\n  };\n};"
    ]
  },
  py: {
    easy: [
      "print('Hello, World!')",
      "def add(a, b):\n    return a + b",
      "count = 0\ncount += 1",
      "items = [1, 2, 3]\nfor item in items:\n    print(item)"
    ],
    medium: [
      "numbers = [1, 2, 3, 4, 5]\nevens = [n for n in numbers if n % 2 == 0]\nprint(evens)",
      "import requests\n\ndef fetch_data(url):\n    response = requests.get(url)\n    return response.json()",
      "class Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        print(f'{self.name} makes a noise.')"
    ],
    hard: [
      "def debounce(wait):\n    def decorator(func):\n        def wrapper(*args, **kwargs):\n            pass\n        return wrapper\n    return decorator",
      "def memoize(fn):\n    cache = {}\n    def wrapper(*args):\n        if args in cache:\n            return cache[args]\n        result = fn(*args)\n        cache[args] = result\n        return result\n    return wrapper"
    ]
  },
  java: {
    easy: [
      "System.out.println(\"Hello, World!\");",
      "public int add(int a, int b) {\n    return a + b;\n}",
      "int count = 0;\ncount++;",
      "int[] items = {1, 2, 3};\nfor (int item : items) {\n    System.out.println(item);\n}"
    ],
    medium: [
      "List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);\nList<Integer> evens = numbers.stream()\n    .filter(n -> n % 2 == 0)\n    .collect(Collectors.toList());",
      "public class Animal {\n    String name;\n    public Animal(String name) {\n        this.name = name;\n    }\n    public void speak() {\n        System.out.println(name + \" makes a noise.\");\n    }\n}"
    ],
    hard: [
      "public class Singleton {\n    private static volatile Singleton instance;\n    private Singleton() {}\n    public static Singleton getInstance() {\n        if (instance == null) {\n            synchronized(Singleton.class) {\n                if (instance == null) instance = new Singleton();\n            }\n        }\n        return instance;\n    }\n}",
      "public <T> CompletableFuture<T> fetchAsync(Supplier<T> supplier) {\n    return CompletableFuture.supplyAsync(supplier)\n        .exceptionally(ex -> {\n            ex.printStackTrace();\n            return null;\n        });\n}"
    ]
  },
  cpp: {
    easy: [
      "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, World!\" << std::endl;\n    return 0;\n}",
      "int add(int a, int b) {\n    return a + b;\n}",
      "int count = 0;\ncount++;",
      "int items[] = {1, 2, 3};\nfor(int item : items) {\n    std::cout << item << \"\\n\";\n}"
    ],
    medium: [
      "#include <vector>\n#include <algorithm>\n\nstd::vector<int> numbers = {1, 2, 3, 4, 5};\nstd::vector<int> evens;\nstd::copy_if(numbers.begin(), numbers.end(), std::back_inserter(evens), [](int n){ return n % 2 == 0; });",
      "class Animal {\n    std::string name;\npublic:\n    Animal(std::string n) : name(n) {}\n    void speak() {\n        std::cout << name << \" makes a noise.\\n\";\n    }\n};"
    ],
    hard: [
      "template<typename T, typename... Args>\nstd::unique_ptr<T> make_unique(Args&&... args) {\n    return std::unique_ptr<T>(new T(std::forward<Args>(args)...));\n}",
      "#include <mutex>\n\nclass ThreadSafeCounter {\n    std::mutex m;\n    int count = 0;\npublic:\n    void increment() {\n        std::lock_guard<std::mutex> lock(m);\n        ++count;\n    }\n};"
    ]
  }
};

function TypingArea({ language, difficulty, onComplete }) {
  const [snippet, setSnippet] = useState('');
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);

  // Metrics state
  const [startTime, setStartTime] = useState(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Live timer
  const [elapsed, setElapsed] = useState(0); // seconds
  const timerRef = useRef(null);

  useEffect(() => {
    const langData = snippetsData[language];
    if (langData) {
      const snippets = langData[difficulty];
      if (snippets && snippets.length > 0) {
        const randomSnippet = snippets[Math.floor(Math.random() * snippets.length)];
        setSnippet(randomSnippet);
      } else {
        setSnippet(`// Snippets for ${language} - ${difficulty} coming soon!`);
      }
    } else {
      setSnippet(`// Language ${language} not found!`);
    }
    // Reset state when snippet changes
    setUserInput('');
    setStartTime(null);
    setTotalErrors(0);
    setIsFinished(false);
    setElapsed(0);
    clearInterval(timerRef.current);
  }, [language, difficulty]);

  // Tick the timer every second while running
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [startTime, isFinished]);

  useEffect(() => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus();
    }
  }, [snippet, isFinished]);

  const handleInputChange = (e) => {
    if (isFinished) return;

    const val = e.target.value;
    
    // Start timer on first keystroke
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    // Check if new keystroke is an error
    if (val.length > userInput.length) {
      const charIndex = val.length - 1;
      if (val[charIndex] !== snippet[charIndex]) {
        setTotalErrors(prev => prev + 1);
      }
    }

    if (val.length <= snippet.length) {
      setUserInput(val);
      
      // Check if finished
      if (val.length === snippet.length) {
        const finishTime = Date.now();
        setIsFinished(true);
        clearInterval(timerRef.current);

        const timeTakenMs = finishTime - (startTime || finishTime);
        const timeTakenSeconds = Math.round(timeTakenMs / 1000);
        setElapsed(timeTakenSeconds);

        const timeTakenMinutes = timeTakenMs / 60000;
        const wordsTyped = snippet.length / 5;
        const wpm = Math.round(wordsTyped / (timeTakenMinutes || 1)) || 0;
        
        // Ensure accuracy doesn't go below 0
        const accuracy = Math.max(0, Math.round(((snippet.length - totalErrors) / snippet.length) * 100));
        
        if (onComplete) {
          onComplete({ wpm, accuracy, timeTaken: timeTakenSeconds });
        }
      }
    }
  };

  const handleContainerClick = () => {
    if (inputRef.current && !isFinished) {
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
      <div className="typing-area-header" style={{ justifyContent: 'flex-end' }}>
        <div className="typing-stats">
          <span>{Math.round((userInput.length / snippet.length) * 100 || 0)}%</span>
          <span className="typing-timer">
            {String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}
          </span>
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
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            if (isFinished) return;

            // Figure out how many spaces the snippet expects at this position
            const pos = userInput.length;
            let spaces = 0;
            while (pos + spaces < snippet.length && snippet[pos + spaces] === ' ') {
              spaces++;
            }
            if (spaces === 0) spaces = 2; // fallback

            const syntheticVal = userInput + ' '.repeat(spaces);
            if (syntheticVal.length <= snippet.length) {
              // Count errors for each space that doesn't match
              let newErrors = 0;
              for (let i = 0; i < spaces; i++) {
                if (snippet[pos + i] !== ' ') newErrors++;
              }
              if (newErrors > 0) setTotalErrors(prev => prev + newErrors);

              setUserInput(syntheticVal);

              if (!startTime) setStartTime(Date.now());

              if (syntheticVal.length === snippet.length) {
                const finishTime = Date.now();
                setIsFinished(true);
                clearInterval(timerRef.current);
                const timeTakenMs = finishTime - (startTime || finishTime);
                const timeTakenSeconds = Math.round(timeTakenMs / 1000);
                setElapsed(timeTakenSeconds);
                const wordsTyped = snippet.length / 5;
                const wpm = Math.round(wordsTyped / ((timeTakenMs / 60000) || 1)) || 0;
                const accuracy = Math.max(0, Math.round(((snippet.length - totalErrors) / snippet.length) * 100));
                if (onComplete) onComplete({ wpm, accuracy, timeTaken: timeTakenSeconds });
              }
            }
          }
        }}
        autoComplete="off"
        spellCheck="false"
      />
    </div>
  );
}

export default TypingArea;
