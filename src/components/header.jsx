import { Link, useLocation } from "react-router-dom";
import GoogleAuth from "./GoogleOath";

function header() {
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
export default header;