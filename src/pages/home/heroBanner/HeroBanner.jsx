import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import useFetch from "../../../hooks/useFetch";
import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";

// This code defines a HeroBanner component that displays a background image, welcome message, and search input field. It fetches upcoming movie data, selects a random background image from the fetched data, and allows users to search for movies or TV shows.
const HeroBanner = () => {
  const user = useSelector((state) => state.user.userData);
  const [background, setBackground] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate(); // Navigation hook from React Router
  const { url } = useSelector((state) => state.home); // Redux selector for home URL

  // Fetch upcoming movie data
  const { data, loading } = useFetch("/movie/upcoming");

  // Set random background image from fetched upcoming data. Image is constructed from base url that we take from home Url with redux selector and the path from api data.
  useEffect(() => {
    if (data?.results?.length > 0 && url.backdrop) {
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const backdropPath = data.results[randomIndex]?.backdrop_path;
      if (backdropPath) {
        const bg = url.backdrop + backdropPath;
        setBackground(bg);
      }
    }
  }, [data, url.backdrop]);

  const seachQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const searchButtonHandler = () => {
    if (query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className="heroBanner">
      {!loading && (
        <div className="backdrop-img">
          <Img src={background} />
        </div>
      )}
      <div className="opacity-layer"></div> {/* Overlay for background image */}
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome</span>
          {!user.uid && <h3>Log in to get personalized recommendations</h3>}
          <span className="subTitle">
            Discover many films and Tv shows tailored just for you. Explore now.
          </span>
          <div className="searchInput">
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search for a movie or tv show..."
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={seachQueryHandler} // Handle Enter key press
            />
            <button onClick={searchButtonHandler}>Search</button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
