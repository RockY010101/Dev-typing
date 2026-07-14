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

function TypingArea({ language, difficulty, onGoBack }) {
  const [snippet, setSnippet] = useState('');
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef(null);

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
