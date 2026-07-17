import React, { useState, useEffect } from 'react';
import { keyboardRows } from './keyboardlayout';
import './Keyboard.css';

const Keyboard = () => {
  const [keyState, setKeyState] = useState({
    activeCodes: [],
    pressedKeys: {}
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeyState((prev) => {
        if (!prev.activeCodes.includes(e.code)) {
          // Limit to 7 keys pressed at a time
          if (prev.activeCodes.length >= 7) {
            return prev;
          }
          return {
            activeCodes: [...prev.activeCodes, e.code],
            pressedKeys: {
              ...prev.pressedKeys,
              [e.key.toLowerCase()]: true,
              [e.code]: true
            }
          };
        }
        return prev;
      });
    };

    const handleKeyUp = (e) => {
      setKeyState((prev) => {
        if (prev.activeCodes.includes(e.code)) {
          const newPressedKeys = { ...prev.pressedKeys };
          delete newPressedKeys[e.key.toLowerCase()];
          delete newPressedKeys[e.code];
          return {
            activeCodes: prev.activeCodes.filter(code => code !== e.code),
            pressedKeys: newPressedKeys
          };
        }
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const isKeyPressed = (keyLabel) => {
    const labelLower = keyLabel.toLowerCase();
    
    // Map special keys from the layout to common KeyboardEvent key or code values
    const keyMap = {
      'backspace': 'backspace',
      'tab': 'tab',
      'caps': 'capslock',
      'enter': 'enter',
      'shift': 'shift',
      'ctrl': 'control',
      'alt': 'alt',
      'win': 'meta',
      'space': ' ',
      'fn': 'fn',
      'menu': 'contextmenu'
    };

    const mappedKey = keyMap[labelLower] || labelLower;
    
    return keyState.pressedKeys[mappedKey] || 
           keyState.pressedKeys[`Key${keyLabel.toUpperCase()}`] ||
           keyState.pressedKeys[`Digit${keyLabel}`] ||
           (labelLower === 'space' && keyState.pressedKeys[' ']);
  };

  return (
    <div className="pixel-keyboard-container">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="pixel-keyboard-row">
          {row.map((keyObj, keyIndex) => {
            const pressed = isKeyPressed(keyObj.key);
            // Default width if not specified
            const keyWidth = keyObj.width ? `${keyObj.width}px` : '44px';
            
            return (
              <div
                key={keyIndex}
                className={`pixel-key ${pressed ? 'pressed' : ''}`}
                style={{ width: keyWidth }}
              >
                <div className="pixel-key-content">
                  {keyObj.key}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
