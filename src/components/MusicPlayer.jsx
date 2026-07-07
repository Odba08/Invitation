// src/components/MusicPlayer.jsx
import React, { useEffect, useState } from "react";
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat } from "lucide-react";
import { CONFIG } from "../config";

export default function MusicPlayer({ isPlaying, setIsPlaying, audioRef }) {
  const [progress, setProgress] = useState(0);

  // Sincronizar el progreso del reproductor
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audioRef]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log("Error al reproducir audio:", err);
      });
    }
  };

  const handleProgressBarClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    
    audio.currentTime = clickPercentage * audio.duration;
    setProgress(clickPercentage * 100);
  };

  return (
    <div className="music-player-card">
      <p className="music-player-subtitle">Dale play a nuestra canción</p>
      
      <div className="music-player-info">
        <div className={`music-disc ${isPlaying ? "spinning" : ""}`}>
          <div className="disc-center"></div>
        </div>
        <div className="music-track-details">
          <p className="song-title">una canción de amor para la pulga</p>
          <p className="song-artist">Camilo</p>
        </div>
      </div>

      <div className="progress-bar-container" onClick={handleProgressBarClick}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="player-controls">
        <button className="control-btn secondary" aria-label="Shuffle">
          <Shuffle size={16} />
        </button>
        <button className="control-btn secondary" aria-label="Previous">
          <SkipBack size={18} />
        </button>
        
        <button className="control-btn play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pausar" : "Reproducir"}>
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="play-icon-offset" />}
        </button>
        
        <button className="control-btn secondary" aria-label="Next">
          <SkipForward size={18} />
        </button>
        <button className="control-btn secondary" aria-label="Repeat">
          <Repeat size={16} />
        </button>
      </div>

      <audio 
        ref={audioRef}
        src={CONFIG.musicUrl}
        loop
        preload="auto"
      />
    </div>
  );
}
