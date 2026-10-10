import Navbar from "../components/Navbar/Navbar";
import Card from "../components/Card/Card";
import { useUserData } from "../context/UserDataContext";
import styles from "./MyList.module.css";

export default function MyList() {
  const { myList, loading } = useUserData();

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.content}>
        <h1>My List</h1>
        {loading ? (
          <div className={styles.loader}>
            <div className="spinner" />
          </div>
        ) : myList.length === 0 ? (
          <div className={styles.empty}>
            <p>Your list is empty.</p>
            <p className={styles.hint}>
              Add movies and shows by clicking the + button on any title.
            </p>
          </div>
        ) : (
          <div className={styles.grid}>
            {myList.map((movie) => (
              <Card key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
