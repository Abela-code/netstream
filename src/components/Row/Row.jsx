import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../Card/Card";
import styles from "./Row.module.css";

export default function Row({ title, movies, ranked = false }) {
  const trackRef = useRef(null);

  if (!movies?.length) return null;

  const scroll = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className={styles.row}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.wrapper}>
        <button
          className={`${styles.arrow} ${styles.left}`}
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <ChevronLeft size={36} />
        </button>

        <div className={styles.track} ref={trackRef}>
          {movies.map((movie, i) => (
            <Card
              key={movie.id}
              movie={movie}
              rank={ranked ? i + 1 : undefined}
            />
          ))}
        </div>

        <button
          className={`${styles.arrow} ${styles.right}`}
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <ChevronRight size={36} />
        </button>
      </div>
    </section>
  );
}
