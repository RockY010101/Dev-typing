import React, { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function GoogleAuth() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
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
            }
            )
                .then((res) => {
                    setProfile(res.data);
                    navigate('/register');
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        setProfile(null);
        setUser(null);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {profile ? (
                <>
                    <img src={profile.picture} alt="user profile" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <button className="nav-link" onClick={logOut} style={{ cursor: 'pointer' }}>
                        logout
                    </button>
                </>
            ) : (
                <>
                    <button className="nav-link" onClick={() => login()} style={{ cursor: 'pointer' }}>
                        login
                    </button>
                    <button className="nav-link" onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
                        register
                    </button>
                </>
            )
            }
        </div >
    );
}