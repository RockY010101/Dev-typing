import { Link } from "react-router-dom";

function home() {
  return (
    <div className="home-container">
      <div className="home-text-center">
        <h1 className="home-title">
          Dev Type
        </h1>
        <p className="home-subtitle">
          Boost your writing with fun games!
        </p>
        <Link 
          to="/practice" 
          className="start-button"
        >
          START PLAYING &rarr;
        </Link>
      </div>
    </div>
  );
}
export default home;