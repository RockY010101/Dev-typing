import { useLocation, useNavigate } from "react-router-dom";
import GoogleAuth from "./GoogleOath";
import MusicPlayer from "./MusicPlayer";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const isPlayingPage = location.pathname.toLowerCase() === '/typing';

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else if (location.pathname !== '/') {
            navigate('/');
        }
    };

    return (
        <header className="header-container">
            {/* Top Left: Music Player + Home & Back buttons (hidden on Home page) */}
            <div className="header-left">
                <MusicPlayer />
                {!isHomePage && (
                    <div className="header-nav-group">
                        <button 
                            className="header-nav-btn" 
                            onClick={() => navigate('/')}
                            title="Go to Home"
                        >
                            Home
                        </button>
                        <button 
                            className="header-nav-btn" 
                            onClick={handleBack}
                            title="Go Back"
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>

            {/* Top Right: Auth & Navigation links (Profile, Leaderboard) - Hidden when playing */}
            {!isPlayingPage && (
                <nav className="nav-links">
                    <GoogleAuth />
                </nav>
            )}
        </header>
    );
}

export default Header;