import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Practice from './pages/practice'
import Typing from './pages/typing'
import Result from './pages/result'
import Header from './components/header'
import Register from './pages/register'
import Profile from './pages/profile'
import bgImage from './assets/background.png'

function App() {

  return (
    <div 
      className="app-container"
      style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}
    >
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
