import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export const img = {
  original: (path) => (path ? `${IMAGE_BASE}/original${path}` : null),
  w500: (path) => (path ? `${IMAGE_BASE}/w500${path}` : null),
  w780: (path) => (path ? `${IMAGE_BASE}/w780${path}` : null),
  poster: (path) => (path ? `${IMAGE_BASE}/w342${path}` : null),
};

const api = axios.create({ baseURL: BASE_URL });

export const requests = {
  trending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  netflixOriginals: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
  topRated: `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  action: `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  comedy: `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  horror: `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  romance: `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  documentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  popularTV: `/tv/popular?api_key=${API_KEY}&language=en-US`,
  upcoming: `/movie/upcoming?api_key=${API_KEY}&language=en-US`,
};

export async function fetchRow(url) {
  const { data } = await api.get(url);
  return data.results || [];
}

export async function fetchMovieDetails(id, type = "movie") {
  const { data } = await api.get(`/${type}/${id}?api_key=${API_KEY}&language=en-US&append_to_response=videos,credits,similar,recommendations`);
  return data;
}

export async function searchMulti(query) {
  if (!query?.trim()) return [];
  const { data } = await api.get(
    `/search/multi?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
  );
  return (data.results || []).filter((r) => r.media_type === "movie" || r.media_type === "tv");
}

// Simple "AI" recommendation engine based on watched titles + genres
export function generateRecommendations(watchedItems, allMovies) {
  if (!watchedItems?.length || !allMovies?.length) return [];

  // Collect genres from watched
  const genreCount = {};
  watchedItems.forEach((item) => {
    (item.genre_ids || []).forEach((g) => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    });
  });

  const watchedIds = new Set(watchedItems.map((w) => w.id));

  // Score remaining movies
  const scored = allMovies
    .filter((m) => !watchedIds.has(m.id))
    .map((m) => {
      let score = 0;
      (m.genre_ids || []).forEach((g) => {
        score += (genreCount[g] || 0) * 2;
      });
      score += (m.vote_average || 0) * 0.5;
      score += Math.random() * 2; // slight randomness
      return { ...m, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 20);

  return scored;
}

export function becauseYouWatched(watchedItem, allMovies) {
  if (!watchedItem || !allMovies?.length) return [];
  const watchedIds = new Set([watchedItem.id]);
  const genres = watchedItem.genre_ids || [];

  return allMovies
    .filter((m) => !watchedIds.has(m.id))
    .map((m) => {
      let score = 0;
      (m.genre_ids || []).forEach((g) => {
        if (genres.includes(g)) score += 3;
      });
      score += (m.vote_average || 0) * 0.3;
      return { ...m, _score: score };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 12);
}

export default api;
