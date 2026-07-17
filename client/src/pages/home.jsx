import { Link } from "react-router-dom";
// import Keyboard from "../components/keyboard/Keyboard";

function home() {
  return (
    <div className="home-container">
      <div className="home-text-center">
        <h1 className="home-title">
          Dev Type
        </h1>
        <p className="home-subtitle">
          Boost your Typing with a FUN game!
        </p>
        <Link 
          to="/practice" 
          className="start-button"
        >
          START PLAYING &rarr;
        </Link>
        {/* <Keyboard /> */}
      </div>
    </div>
  );
}
export default home;