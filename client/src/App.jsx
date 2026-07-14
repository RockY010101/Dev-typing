import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Practice from './pages/practice'
import Typing from './pages/typing'
import Result from './pages/result'
import Header from './components/header'
import Register from './pages/register'
import bgImage from './assets/background.png'

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div 
      className="app-container"
      style={isHomePage 
        ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' } 
        : { backgroundColor: '#0f0a0a' }
      }
    >
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/typing" element={<Typing />} />
          <Route path="/result" element={<Result />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
