/* import React from 'react' */
import Style from "./MovieCard.module.css";
import { FaPlayCircle } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { IoIosArrowDropdownCircle } from "react-icons/io";

const imageBase = "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie }) {
  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  const genres = movie?.genre_ids
    ?.map((id) => genreMap[id])
    .filter(Boolean)
    .slice(0, 3);
  return (
    <div className={Style.cardWrapper}>
      {/* Poster image */}
      <img
        className={Style.poster}
        src={`${imageBase}${movie?.poster_path}`}
        alt="poster image"
      />

      {/* hover card */}
      <div className={Style.hoverCard}>
        {/* img */}
        <img
          className={Style.hoverImage}
          src={`${imageBase}${movie?.poster_path}`}
          alt="hover image"
        />
        {/* badge */}
        <div className={Style.badge}>recently added</div>
        {/* button row */}
        <div className={Style.buttonRow}>
          <FaPlayCircle className={Style.actionIcon} color="white" size={30} />
          <BsPlusCircle className={Style.actionIcon} color="white" size={30} />
          <FaHeart className={Style.actionIcon} color="white" size={30} />
          <IoIosArrowDropdownCircle
            color="white"
            size={30}
            className={`${Style.actionIcon} ${Style.circleButtonSmall}`}
          />
        </div>
        {/* meta data row */}
        <div className={Style.metaRow}>
          <span className={Style.tag}>U/A 16+</span>
          <span className={Style.tag}>Movies</span>
          <span className={Style.tag}>HD</span>
        </div>
        {/* genres */}
        <div className={Style.genres}>
          {genres?.map((g, index) => {
            return (
              <span key={index}>
                {g}
                {index < genres.length - 1 && (
                  <span className={Style.dot}> • </span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
