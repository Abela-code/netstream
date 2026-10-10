import { useNavigate } from "react-router-dom";
import { Play, Plus, Check, Info } from "lucide-react";
import { img } from "../../services/tmdb";
import { useUserData } from "../../context/UserDataContext";
import styles from "./Card.module.css";

export default function Card({ movie, rank }) {
  const navigate = useNavigate();
  const { isInMyList, addToMyList, removeFromMyList } = useUserData();
  const title = movie.title || movie.name || movie.original_name;
  const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const inList = isInMyList(movie.id);

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/watch/${type}/${movie.id}`);
  };

  const handleInfo = (e) => {
    e.stopPropagation();
    navigate(`/title/${type}/${movie.id}`);
  };

  const handleList = (e) => {
    e.stopPropagation();
    if (inList) removeFromMyList(movie.id);
    else addToMyList(movie);
  };

  return (
    <div
      className={`${styles.card} ${rank ? styles.ranked : ""}`}
      onClick={() => navigate(`/title/${type}/${movie.id}`)}
    >
      {rank && <span className={styles.rank}>{rank}</span>}
      <div className={styles.poster}>
        <img
          src={img.poster(movie.poster_path) || img.w500(movie.backdrop_path)}
          alt={title}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <div className={styles.actions}>
            <button className={styles.playBtn} onClick={handlePlay} title="Play">
              <Play size={18} fill="currentColor" />
            </button>
            <button
              className={styles.circleBtn}
              onClick={handleList}
              title={inList ? "Remove from My List" : "Add to My List"}
            >
              {inList ? <Check size={16} /> : <Plus size={16} />}
            </button>
            <button className={styles.circleBtn} onClick={handleInfo} title="More Info">
              <Info size={16} />
            </button>
          </div>
          <div className={styles.meta}>
            <p className={styles.title}>{title}</p>
            {movie.vote_average > 0 && (
              <span className={styles.rating}>
                ★ {movie.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
