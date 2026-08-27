import { useEffect, useState } from "react";
import SlideShow from "../SlideShow/SlideShow.jsx";
// import {movies} from '../../Data/Data'
import movieInstance from "../../utilities/movieInstance.js";
import requests from "../../utilities/requestUrls.js";
export default function DisplayRow() {
  const [movies, setMovies] = useState({
    Trending: [],
    NetflixOriginals: [],
    TopRatedMovies: [],
    ActionMovies: [],
    ComedyMovies: [],
    HorrorMovies: [],
    RomanceMovies: [],
    Documentaries: [],
  });
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [
        trendingRes,
        netflixRes,
        topRatedRes,
        actionRes,
        comedyRes,
        horrorRes,
        romanceRes,
        docRes,
      ] = await Promise.all([
        movieInstance.get(requests.fetchTrending),
        movieInstance.get(requests.fetchNetflixOriginals),
        movieInstance.get(requests.fetchTopRatedMovies),
        movieInstance.get(requests.fetchActionMovies),
        movieInstance.get(requests.fetchComedyMovies),
        movieInstance.get(requests.fetchHorrorMovies),
        movieInstance.get(requests.fetchRomanceMovies),
        movieInstance.get(requests.fetchDocumentaries),
      ]);
      setMovies({
        Trending: trendingRes.data.results,
        NetflixOriginals: netflixRes.data.results,
        TopRatedMovies: topRatedRes.data.results,
        ActionMovies: actionRes.data.results,
        ComedyMovies: comedyRes.data.results,
        HorrorMovies: horrorRes.data.results,
        RomanceMovies: romanceRes.data.results,
        Documentaries: docRes.data.results,
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mainWrapper">
      <SlideShow title="Movie suggestion" movies={movies.Trending} />
      <SlideShow title="Popular on netflix" movies={movies.NetflixOriginals} />
      <SlideShow title="Top Rated" movies={movies.TopRatedMovies} />
      <SlideShow title="Action" movies={movies.ActionMovies} />
    </div>
  );
}
