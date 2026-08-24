import React, { useState, useRef, useEffect } from 'react';
import { lofiTracks } from '../data/lofiTracks';
import { 
  FaPlay, 
  FaPause, 
  FaBackwardStep, 
  FaForwardStep,
  FaShuffle,
  FaRepeat,
  FaVolumeHigh,
  FaVolumeXmark
} from 'react-icons/fa6';
import './MusicPlayer.css';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [lastVolume, setLastVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  const audioRef = useRef(null);
  const currentTrack = lofiTracks[currentTrackIndex] || lofiTracks[0];

  // Sync loop state with HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isRepeat;
    }
  }, [isRepeat]);

  // Sync volume with HTML5 audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Handle Autoplay & Track changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = isMuted ? 0 : volume;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(() => {
            setIsPlaying(false);
            setAutoplayBlocked(true);

            const handleUserGesture = () => {
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => {
                    setIsPlaying(true);
                    setAutoplayBlocked(false);
                  })
                  .catch(() => {});
              }
              window.removeEventListener('click', handleUserGesture);
              window.removeEventListener('keydown', handleUserGesture);
              window.removeEventListener('touchstart', handleUserGesture);
            };

            window.addEventListener('click', handleUserGesture);
            window.addEventListener('keydown', handleUserGesture);
            window.addEventListener('touchstart', handleUserGesture);
          });
      }
    }
  }, [currentTrackIndex]);

  // Play / Pause toggle
  const togglePlayPause = (e) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch(err => console.log("Play error:", err));
    }
  };

  // Backtrack Control
  const handleBackTrack = (e) => {
    if (e) e.stopPropagation();
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      if (isShuffle) {
        const randomIndex = Math.floor(Math.random() * lofiTracks.length);
        setCurrentTrackIndex(randomIndex);
      } else {
        setCurrentTrackIndex((prevIndex) => 
          prevIndex === 0 ? lofiTracks.length - 1 : prevIndex - 1
        );
      }
    }
  };

  // Forward Track Control
  const handleNextTrack = (e) => {
    if (e) e.stopPropagation();
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * lofiTracks.length);
      if (randomIndex === currentTrackIndex && lofiTracks.length > 1) {
        randomIndex = (currentTrackIndex + 1) % lofiTracks.length;
      }
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % lofiTracks.length);
    }
  };

  // Toggle Mute
  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    if (isMuted) {
      setIsMuted(false);
      if (volume === 0) setVolume(lastVolume || 0.8);
    } else {
      setLastVolume(volume);
      setIsMuted(true);
    }
  };

  // Handle Volume Slider Change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  // Toggle Shuffle
  const toggleShuffle = (e) => {
    if (e) e.stopPropagation();
    setIsShuffle((prev) => !prev);
  };

  // Toggle Repeat
  const toggleRepeat = (e) => {
    if (e) e.stopPropagation();
    setIsRepeat((prev) => !prev);
  };

  return (
    <div className="lofi-bar-container">
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onEnded={handleNextTrack}
        preload="auto"
      />

      <div className="lofi-bar-controls">
        {/* 1. Volume Icon with Vertical Popup Slider */}
        <div 
          className="lofi-volume-wrapper"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          {showVolumeSlider && (
            <div className="volume-slider-popup" onClick={(e) => e.stopPropagation()}>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="horizontal-volume-input"
                aria-label="Volume Slider"
              />
            </div>
          )}
          <button 
            className={`lofi-bar-btn ${(isMuted || volume === 0) ? 'muted' : ''}`} 
            onClick={toggleMute}
            title={(isMuted || volume === 0) ? "Unmute" : "Mute"}
            aria-label="Volume"
          >
            {(isMuted || volume === 0) ? <FaVolumeXmark /> : <FaVolumeHigh />}
          </button>
        </div>

        {/* 2. Shuffle Icon */}
        <button 
          className={`lofi-bar-btn ${isShuffle ? 'active' : ''}`} 
          onClick={toggleShuffle}
          title="Shuffle"
          aria-label="Shuffle"
        >
          <FaShuffle />
        </button>

        {/* 3. Previous Track */}
        <button 
          className="lofi-bar-btn lofi-step-btn" 
          onClick={handleBackTrack}
          title="Previous Track"
          aria-label="Previous Track"
        >
          <FaBackwardStep />
        </button>

        {/* 4. Play/Pause Main Square Pixel Button */}
        <button 
          className={`lofi-main-square-btn ${autoplayBlocked && !isPlaying ? 'pulse' : ''}`} 
          onClick={togglePlayPause}
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <FaPause className="square-icon" />
          ) : (
            <FaPlay className="square-icon play-offset" />
          )}
        </button>

        {/* 5. Next Track */}
        <button 
          className="lofi-bar-btn lofi-step-btn" 
          onClick={handleNextTrack}
          title="Next Track"
          aria-label="Next Track"
        >
          <FaForwardStep />
        </button>

        {/* 6. Repeat Icon */}
        <button 
          className={`lofi-bar-btn ${isRepeat ? 'active' : ''}`} 
          onClick={toggleRepeat}
          title="Repeat"
          aria-label="Repeat"
        >
          <FaRepeat />
        </button>

        {/* Bottom Right Diagonal Grip Lines */}
        <div className="lofi-corner-grip" title="Audio Player Controls">
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
