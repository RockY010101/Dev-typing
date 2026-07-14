import { useLocation } from "react-router-dom";
import GoogleAuth from "./GoogleOath";

function Header() {
    const location = useLocation();
    const isPracticeOpen = location.pathname === '/Practice';

    return (
        <header className="header-container">
            {!isPracticeOpen && (
                <nav className="nav-links">
                    <GoogleAuth />
                </nav>
            )}
        </header>
    );
}
export default Header;