import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ArrowLeft,
  SkipForward,
} from "lucide-react";
import { fetchMovieDetails, img } from "../services/tmdb";
import { useUserData } from "../context/UserDataContext";
import styles from "./Watch.module.css";

export default function Watch() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { updateContinueWatching } = useUserData();
  const [movie, setMovie] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [episode, setEpisode] = useState(1);
  const intervalRef = useRef(null);
  const hideTimer = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchMovieDetails(id, type);
        setMovie(data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, [id, type]);

  // Fake progress simulation
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          const next = Math.min(p + 0.15, 100);
          if (next >= 100) {
            setPlaying(false);
            return 100;
          }
          return next;
        });
      }, 200);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  // Save progress periodically
  useEffect(() => {
    if (movie && progress > 2 && progress % 5 < 0.2) {
      updateContinueWatching(movie, Math.round(progress), type === "tv" ? episode : null);
    }
  }, [progress, movie, episode, type, updateContinueWatching]);

  // Auto-hide controls
  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [playing]);

  const formatTime = (pct) => {
    const totalSec = 5400; // fake 90 min
    const current = Math.floor((pct / 100) * totalSec);
    const m = Math.floor(current / 60);
    const s = current % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!movie) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }

  const title = movie.title || movie.name;
  const isTV = type === "tv" || movie.number_of_seasons;

  return (
    <div
      className={styles.player}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
    >
      {/* Background as "video" */}
      <div
        className={styles.videoArea}
        style={{
          backgroundImage: `url(${img.original(movie.backdrop_path)})`,
        }}
      >
        {!playing && (
          <button
            className={styles.bigPlay}
            onClick={() => setPlaying(true)}
          >
            <Play size={64} fill="currentColor" />
          </button>
        )}
      </div>

      {/* Controls overlay */}
      <div className={`${styles.controls} ${showControls ? styles.visible : ""}`}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={28} />
          </button>
          <div className={styles.titleBlock}>
            <h2>{title}</h2>
            {isTV && (
              <span>
                S1:E{episode} · Episode {episode}
              </span>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          {/* Progress */}
          <div
            className={styles.progressBar}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = ((e.clientX - rect.left) / rect.width) * 100;
              setProgress(Math.max(0, Math.min(100, pct)));
            }}
          >
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            <div
              className={styles.progressThumb}
              style={{ left: `${progress}%` }}
            />
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.leftControls}>
              <button onClick={() => setPlaying(!playing)}>
                {playing ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </button>
              {isTV && (
                <button
                  onClick={() => {
                    setEpisode((e) => e + 1);
                    setProgress(0);
                    setPlaying(true);
                  }}
                  title="Next Episode"
                >
                  <SkipForward size={24} />
                </button>
              )}
              <button onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
              <span className={styles.time}>
                {formatTime(progress)} / 1:30:00
              </span>
            </div>

            <div className={styles.rightControls}>
              <button>
                <Maximize size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
