import { useNavigate } from "react-router-dom";
import { Play, Info } from "lucide-react";
import { img } from "../../services/tmdb";
import styles from "./Hero.module.css";

export default function Hero({ movie }) {
  const navigate = useNavigate();
  if (!movie) return null;

  const title = movie.title || movie.name || movie.original_name;
  const type = movie.media_type || (movie.first_air_date ? "tv" : "movie");
  const overview =
    movie.overview?.length > 180
      ? movie.overview.slice(0, 180) + "..."
      : movie.overview;

  return (
    <section
      className={styles.hero}
      style={{
        backgroundImage: `url(${img.original(movie.backdrop_path)})`,
      }}
    >
      <div className={styles.gradient} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.overview}>{overview}</p>
        <div className={styles.buttons}>
          <button
            className={styles.play}
            onClick={() => navigate(`/watch/${type}/${movie.id}`)}
          >
            <Play size={24} fill="currentColor" />
            Play
          </button>
          <button
            className={styles.info}
            onClick={() => navigate(`/title/${type}/${movie.id}`)}
          >
            <Info size={24} />
            More Info
          </button>
        </div>
      </div>
    </section>
  );
}
