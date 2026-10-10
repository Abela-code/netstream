import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar/Navbar";
import Card from "../components/Card/Card";
import { searchMulti } from "../services/tmdb";
import styles from "./Search.module.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchMulti(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.searchBar}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies and TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className={styles.loader}>
            <div className="spinner" />
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <p className={styles.noResults}>
            No results found for "{query}"
          </p>
        )}

        {results.length > 0 && (
          <>
            <h2 className={styles.heading}>
              Results for "{query}"
            </h2>
            <div className={styles.grid}>
              {results.map((movie) => (
                <Card key={`${movie.media_type}-${movie.id}`} movie={movie} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
