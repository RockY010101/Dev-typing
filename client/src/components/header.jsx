import { useLocation } from "react-router-dom";
import GoogleAuth from "./GoogleOath";
import MusicPlayer from "./MusicPlayer";

function Header() {
    const location = useLocation();
    const isPracticePage = location.pathname.toLowerCase() === '/practice';

    return (
        <header className="header-container">
            {/* Top Left: Pixelated Lofi Music Player */}
            <div className="header-left">
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