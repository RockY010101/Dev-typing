import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleAuth from '../components/GoogleOath';

function Register() {
  const [customName, setCustomName] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (customName.trim()) {
      localStorage.setItem('devTypeUsername', customName.trim());
      navigate('/');
    }
  };

  return (
    <div className="home-container">
      <div className="practice-card modal-animate" style={{ maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 className="practice-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>REGISTER</h2>
        <p className="practice-subtitle" style={{ marginBottom: '2rem' }}>Choose your Dev Name</p>
        
        <form onSubmit={handleRegister} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <input
            type="text"
            className="custom-input"
            placeholder="Enter custom name..."
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            autoFocus
            maxLength={15}
          />
          <button 
            type="submit" 
            className="start-typing-btn" 
            disabled={!customName.trim()}
          >
            CONFIRM &rarr;
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '2rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          <span style={{ margin: '0 1rem', color: '#9ca3af', fontFamily: 'monospace' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
        </div>

        <GoogleAuth />
      </div>
    </div>
  );
}

export default Register;
