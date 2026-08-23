import { useLocation, useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleOath";
import MusicPlayer from "./MusicPlayer";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const isPracticePage = location.pathname.toLowerCase() === '/practice';
    const isHome = location.pathname === '/';

    return (
        <header className="header-container">
            {/* Top Left: Navigation & Music Player */}
            <div className="header-left" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        title="Go Back"
                        style={{ background: 'rgba(30,20,15,0.9)', border: '1px solid rgba(249,115,22,0.4)', color: 'white', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.2rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
                    >
                        &#8592;
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        title="Go to Home"
                        style={{ background: 'rgba(30,20,15,0.9)', border: '1px solid rgba(249,115,22,0.4)', color: 'white', borderRadius: '8px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '1.1rem', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#f97316'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'}
                    >
                        🏠
                    </button>
                </div>
                <MusicPlayer />
            </div>

            {/* Top Right: Auth & Navigation links */}
            {!isPracticePage && (
                <nav className="nav-links">
                    <GoogleAuth />
                </nav>
            )}
        </header>
    );
}

export default Header;