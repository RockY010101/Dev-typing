import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Practice from './pages/practice'
import Typing from './pages/typing'
import Result from './pages/result'
import Header from './components/header'
import Register from './pages/register'
import Profile from './pages/profile'
import bgImage from './assets/background.webp'

function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div 
      className="app-container"
      style={!isHome ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' } : {}}
    >
      {isHome && (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="home-video-bg"
          poster={bgImage}
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>
      )}
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/typing" element={<Typing />} />
          <Route path="/result" element={<Result />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
