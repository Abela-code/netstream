import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Row from "../components/Row/Row";
import { fetchRow, requests, generateRecommendations, becauseYouWatched } from "../services/tmdb";
import { useUserData } from "../context/UserDataContext";
import styles from "./Browse.module.css";

export default function Browse() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category"); // tv | movies | new | language | null

  const [data, setData] = useState({
    trending: [],
    originals: [],
    topRated: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    docs: [],
    popularTV: [],
    upcoming: [],
  });
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const { continueWatching, myList } = useUserData();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [
          trending,
          originals,
          topRated,
          action,
          comedy,
          horror,
          romance,
          docs,
          popularTV,
          upcoming,
        ] = await Promise.all([
          fetchRow(requests.trending),
          fetchRow(requests.netflixOriginals),
          fetchRow(requests.topRated),
          fetchRow(requests.action),
          fetchRow(requests.comedy),
          fetchRow(requests.horror),
          fetchRow(requests.romance),
          fetchRow(requests.documentaries),
          fetchRow(requests.popularTV),
          fetchRow(requests.upcoming),
        ]);

        setData({
          trending,
          originals,
          topRated,
          action,
          comedy,
          horror,
          romance,
          docs,
          popularTV,
          upcoming,
        });

        // Hero depends on category
        let pool = [];
        if (category === "tv") pool = [...popularTV, ...originals];
        else if (category === "movies") pool = [...topRated, ...action, ...comedy];
        else if (category === "new") pool = [...upcoming, ...trending];
        else pool = [...trending, ...originals];

        pool = pool.filter((m) => m.backdrop_path);
        setHero(pool[Math.floor(Math.random() * pool.length)] || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  // AI recommendations
  const allMovies = [
    ...data.trending,
    ...data.topRated,
    ...data.action,
    ...data.comedy,
    ...data.horror,
  ];
  const watchedForAI = [...continueWatching, ...myList];
  const personalized = generateRecommendations(watchedForAI, allMovies);
  const becauseOf =
    continueWatching[0] || myList[0]
      ? becauseYouWatched(continueWatching[0] || myList[0], allMovies)
      : [];

  const top10 = data.trending.slice(0, 10);

  const pageTitle = {
    tv: "TV Shows",
    movies: "Movies",
    new: "New & Popular",
    language: "Browse by Language",
  }[category];

  if (loading) {
    return (
      <div className="full-loader">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <Hero movie={hero} />

      <div className={styles.rows}>
        {pageTitle && <h1 className={styles.categoryTitle}>{pageTitle}</h1>}

        {/* Home (default) */}
        {!category && (
          <>
            {continueWatching.length > 0 && (
              <Row title="Continue Watching" movies={continueWatching} />
            )}
            {personalized.length > 0 && (
              <Row title="Recommended for You" movies={personalized} />
            )}
            {becauseOf.length > 0 && (
              <Row
                title={`Because you watched ${
                  (continueWatching[0] || myList[0])?.title ||
                  (continueWatching[0] || myList[0])?.name ||
                  "something"
                }`}
                movies={becauseOf}
              />
            )}
            <Row title="Top 10 in Your Country Today" movies={top10} ranked />
            <Row title="Trending Now" movies={data.trending} />
            <Row title="Netflix Originals" movies={data.originals} />
            <Row title="Top Rated" movies={data.topRated} />
            <Row title="Action" movies={data.action} />
            <Row title="Comedy" movies={data.comedy} />
            <Row title="Horror" movies={data.horror} />
            <Row title="Romance" movies={data.romance} />
            <Row title="Documentaries" movies={data.docs} />
            <Row title="Popular TV Shows" movies={data.popularTV} />
          </>
        )}

        {/* TV Shows */}
        {category === "tv" && (
          <>
            <Row title="Popular on Netflix" movies={data.originals} />
            <Row title="Trending TV" movies={data.trending.filter((m) => m.media_type === "tv" || m.first_air_date)} />
            <Row title="Popular TV Shows" movies={data.popularTV} />
            <Row title="Netflix Originals" movies={data.originals} />
          </>
        )}

        {/* Movies */}
        {category === "movies" && (
          <>
            <Row title="Top Rated Movies" movies={data.topRated} />
            <Row title="Action" movies={data.action} />
            <Row title="Comedy" movies={data.comedy} />
            <Row title="Horror" movies={data.horror} />
            <Row title="Romance" movies={data.romance} />
            <Row title="Documentaries" movies={data.docs} />
            <Row title="Trending Movies" movies={data.trending.filter((m) => m.media_type === "movie" || m.release_date)} />
          </>
        )}

        {/* New & Popular */}
        {category === "new" && (
          <>
            <Row title="Top 10 Today" movies={top10} ranked />
            <Row title="Coming Soon" movies={data.upcoming} />
            <Row title="Trending Now" movies={data.trending} />
            <Row title="New on Netflix" movies={data.originals} />
          </>
        )}

        {/* Browse by Language – show same rows with a note for now */}
        {category === "language" && (
          <>
            <p className={styles.langNote}>
              Showing titles available in English. More languages coming soon.
            </p>
            <Row title="Popular in English" movies={data.trending} />
            <Row title="Top Rated" movies={data.topRated} />
            <Row title="Netflix Originals" movies={data.originals} />
            <Row title="Popular TV Shows" movies={data.popularTV} />
          </>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Netflix Clone · Built with React + Firebase · For educational purposes</p>
      </footer>
    </div>
  );
}
