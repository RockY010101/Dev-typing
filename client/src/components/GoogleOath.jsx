import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GoogleAuth() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(() => {
        const savedProfile = localStorage.getItem('profile');
        return savedProfile ? JSON.parse(savedProfile) : null;
    });
    const [dbUser, setDbUser] = useState(() => {
        const savedDbUser = localStorage.getItem('dbUser');
        return savedDbUser ? JSON.parse(savedDbUser) : null;
    });
    
    const [showUsernameModal, setShowUsernameModal] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [usernameError, setUsernameError] = useState('');

    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
    });

    useEffect(() => {
        if (user) {
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json',
                },
            })
            .then((res) => {
                setProfile(res.data);
                localStorage.setItem('profile', JSON.stringify(res.data));
                
                // Now authenticate with our backend
                return axios.post('/api/users/auth', {
                    email: res.data.email,
                    googleId: res.data.id,
                    picture: res.data.picture,
                    name: res.data.name
                });
            })
            .then((backendRes) => {
                setDbUser(backendRes.data);
                localStorage.setItem('dbUser', JSON.stringify(backendRes.data));
                
                if (backendRes.data.isNewUser || !backendRes.data.username) {
                    setShowUsernameModal(true);
                } else if (window.location.pathname === '/register') {
                    navigate('/');
                }
            })
            .catch((err) => console.log(err));
        }
    }, [user, navigate]);

    useEffect(() => {
        if (profile && !dbUser) {
            axios.post('/api/users/auth', {
                email: profile.email,
                googleId: profile.id,
                picture: profile.picture,
                name: profile.name
            })
            .then((backendRes) => {
                setDbUser(backendRes.data);
                localStorage.setItem('dbUser', JSON.stringify(backendRes.data));
                if (backendRes.data.isNewUser || !backendRes.data.username) {
                    setShowUsernameModal(true);
                }
            })
            .catch((err) => console.log(err));
        }
    }, [profile, dbUser]);

    const handleUsernameSubmit = () => {
        if (!usernameInput) {
            setUsernameError("Username cannot be empty");
            return;
        }
        axios.post('/api/users/username', {
            userId: dbUser._id,
            username: usernameInput
        }).then((res) => {
            setDbUser(res.data);
            localStorage.setItem('dbUser', JSON.stringify(res.data));
            setShowUsernameModal(false);
            if (window.location.pathname === '/register') {
                navigate('/');
            }
        }).catch(err => {
            setUsernameError(err.response?.data?.message || "Error setting username");
        });
    };

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
        setDbUser(null);
        localStorage.removeItem('profile');
        localStorage.removeItem('dbUser');
        if (window.location.pathname === '/profile') {
            navigate('/');
        }
    };

    return (
        <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {profile ? (
                    <>
                        <img src={profile.picture} alt="user profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                        {dbUser && !showUsernameModal && (
                            <button className="nav-link" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                                Profile
                            </button>
                        )}
                        <button className="nav-link" onClick={logOut} style={{ cursor: 'pointer' }}>
                            logout
                        </button>
                    </>
                ) : (
                    <button className="nav-link" onClick={() => login()} style={{ cursor: 'pointer' }}>
                        Sign in with Google
                    </button>
                )}
            </div>

            {/* Username Modal */}
            {showUsernameModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#1e140f', padding: '2rem', borderRadius: '12px', border: '1px solid #f97316', color: 'white', textAlign: 'center', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontFamily: '"Press Start 2P", monospace', fontSize: '1rem', color: '#facc15' }}>Choose a Username</h3>
                        <input 
                            type="text" 
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            placeholder="Enter username"
                            className="custom-input"
                            style={{ width: '100%', marginBottom: '1rem', boxSizing: 'border-box' }}
                        />
                        {usernameError && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{usernameError}</p>}
                        <button onClick={handleUsernameSubmit} className="start-typing-btn" style={{ width: '100%', minWidth: 'auto', padding: '0.75rem' }}>
                            Save Username
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}