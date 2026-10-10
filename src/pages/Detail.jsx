import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Plus, Check, ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import Row from "../components/Row/Row";
import { fetchMovieDetails, img } from "../services/tmdb";
import { useUserData } from "../context/UserDataContext";
import styles from "./Detail.module.css";

export default function Detail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isInMyList, addToMyList, removeFromMyList } = useUserData();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(id, type);
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, type]);

  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className={styles.notFound}>Title not found</div>
      </div>
    );
  }

  const title = movie.title || movie.name;
  const inList = isInMyList(movie.id);
  const year = (movie.release_date || movie.first_air_date || "").slice(0, 4);
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : movie.number_of_seasons
    ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? "s" : ""}`
    : null;

  return (
    <div className={styles.page}>
      <Navbar />
      <div
        className={styles.hero}
        style={{
          backgroundImage: `url(${img.original(movie.backdrop_path)})`,
        }}
      >
        <div className={styles.overlay} />
        <button className={styles.back} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>

        <div className={styles.content}>
          <h1>{title}</h1>
          <div className={styles.meta}>
            {movie.vote_average > 0 && (
              <span className={styles.score}>★ {movie.vote_average.toFixed(1)}</span>
            )}
            {year && <span>{year}</span>}
            {runtime && <span>{runtime}</span>}
            <span className={styles.hd}>HD</span>
          </div>
          <p className={styles.overview}>{movie.overview}</p>

          <div className={styles.actions}>
            <button
              className={styles.play}
              onClick={() => navigate(`/watch/${type}/${id}`)}
            >
              <Play size={22} fill="currentColor" />
              Play
            </button>
            <button
              className={styles.listBtn}
              onClick={() => (inList ? removeFromMyList(movie.id) : addToMyList(movie))}
            >
              {inList ? <Check size={22} /> : <Plus size={22} />}
              {inList ? "In My List" : "My List"}
            </button>
          </div>

          {movie.genres?.length > 0 && (
            <p className={styles.genres}>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((g) => g.name).join(", ")}
            </p>
          )}
        </div>
      </div>

      {movie.recommendations?.results?.length > 0 && (
        <div className={styles.recs}>
          <Row title="More Like This" movies={movie.recommendations.results} />
        </div>
      )}
    </div>
  );
}
