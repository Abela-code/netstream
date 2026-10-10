import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

const UserDataContext = createContext(null);

export function useUserData() {
  return useContext(UserDataContext);
}

export function UserDataProvider({ children }) {
  const { user, activeProfile } = useAuth();
  const [myList, setMyList] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDocRef = useCallback(() => {
    if (!user || !activeProfile) return null;
    return doc(db, "users", user.uid, "profiles", activeProfile.id, "data", "lists");
  }, [user, activeProfile]);

  // Load user data when profile changes
  useEffect(() => {
    if (!user || !activeProfile) {
      setMyList([]);
      setContinueWatching([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const ref = getDocRef();
        if (!ref) return;
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setMyList(data.myList || []);
          setContinueWatching(data.continueWatching || []);
        } else {
          // Initialize empty lists
          await setDoc(ref, { myList: [], continueWatching: [] });
          setMyList([]);
          setContinueWatching([]);
        }
      } catch (err) {
        console.error("Failed to load user data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, activeProfile, getDocRef]);

  // Add to My List
  const addToMyList = async (movie) => {
    if (!user || !activeProfile) return;
    const item = {
      id: movie.id,
      title: movie.title || movie.name || movie.original_name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      media_type: movie.media_type || (movie.first_air_date ? "tv" : "movie"),
      overview: movie.overview,
      vote_average: movie.vote_average,
      addedAt: new Date().toISOString(),
    };
    // Avoid duplicates
    if (myList.some((m) => m.id === item.id)) return;

    const newList = [...myList, item];
    setMyList(newList);

    const ref = getDocRef();
    if (ref) {
      await setDoc(ref, { myList: newList, continueWatching }, { merge: true });
    }
  };

  // Remove from My List
  const removeFromMyList = async (movieId) => {
    if (!user || !activeProfile) return;
    const newList = myList.filter((m) => m.id !== movieId);
    setMyList(newList);

    const ref = getDocRef();
    if (ref) {
      await setDoc(ref, { myList: newList, continueWatching }, { merge: true });
    }
  };

  const isInMyList = (movieId) => myList.some((m) => m.id === movieId);

  // Update Continue Watching (progress 0-100)
  const updateContinueWatching = async (movie, progress = 10, episode = null) => {
    if (!user || !activeProfile) return;

    const item = {
      id: movie.id,
      title: movie.title || movie.name || movie.original_name,
      poster_path: movie.poster_path,
      backdrop_path: movie.backdrop_path,
      media_type: movie.media_type || (movie.first_air_date ? "tv" : "movie"),
      progress, // percentage
      episode,
      lastWatched: new Date().toISOString(),
    };

    // Remove existing entry for this movie then add updated one at front
    let list = continueWatching.filter((m) => m.id !== item.id);
    // Only keep if progress < 95%
    if (progress < 95) {
      list = [item, ...list].slice(0, 20); // keep max 20
    }
    setContinueWatching(list);

    const ref = getDocRef();
    if (ref) {
      await setDoc(ref, { myList, continueWatching: list }, { merge: true });
    }
  };

  const removeFromContinueWatching = async (movieId) => {
    const list = continueWatching.filter((m) => m.id !== movieId);
    setContinueWatching(list);
    const ref = getDocRef();
    if (ref) {
      await setDoc(ref, { myList, continueWatching: list }, { merge: true });
    }
  };

  const value = {
    myList,
    continueWatching,
    loading,
    addToMyList,
    removeFromMyList,
    isInMyList,
    updateContinueWatching,
    removeFromContinueWatching,
  };

  return (
    <UserDataContext.Provider value={value}>{children}</UserDataContext.Provider>
  );
}
