import { useEffect, useState } from "react";
import NetflixBannerLogo from "../../assets/image/logo.png";
import { Info, Play } from "lucide-react";
import Style from "./Banner.module.css";
import movieInstance from "../../utilities/movieInstance";
import requests from "../../utilities/requestUrls";
const BANNER_BASE = "https://image.tmdb.org/t/p/original/";

export default function Banner() {
  const [bannerImage, setBannerImage] = useState({});

  useEffect(() => {
    async function fetchBannerImage() {
      const request = await movieInstance.get(requests.fetchNetflixOriginals);
      setBannerImage(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length)
        ],
      );
    }
    fetchBannerImage();
  }, []);

  const truncate = (str, n) =>
    str?.length > n ? str.substr(0, n - 1) + "..." : str;
  return (
    <div
      className={Style.banner}
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("${BANNER_BASE}${bannerImage.backdrop_path}")`,
      }}
    >
      <div className={Style.contents}>
        {/* netflix image */}
        <img className={Style.logoImg} src={NetflixBannerLogo} alt="" />
        {/* title */}
        <h1 className={Style.title}>{bannerImage?.original_name}</h1>
        {/* description */}
        <h1 className={Style.description}>
          {truncate(bannerImage?.overview, 140)}
        </h1>
        {/* buttons */}
        <div className={Style.buttonContainer}>
          <button className={Style.button}>
            {" "}
            <Play size={30} />
            play
          </button>
          <button className={Style.button}>
            <Info size={30} />
            My List
          </button>
        </div>
      </div>
      {/* fading */}
      <div className={Style.fadeBottom}></div>
    </div>
  );
}
