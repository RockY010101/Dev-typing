import { useLocation } from "react-router-dom";
import GoogleAuth from "./GoogleOath";
import MusicPlayer from "./MusicPlayer";

function Header() {
    const location = useLocation();
    const isPracticePage = location.pathname.toLowerCase() === '/practice';

    return (
        <header className="header-container">
            {/* Top Left: Music Player */}
            <div className="header-left" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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