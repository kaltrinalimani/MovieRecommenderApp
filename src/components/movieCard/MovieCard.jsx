import React from "react";
import { useMemo } from "react"; // useMemo is used to memoize the favoriteMedia array to avoid unnecessary recalculations.
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../../store/userSlice";
import {
  updateFavoriteMediaInFirestore,
  removeFavoriteMediaFromFirestore,
} from "../../firestore";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";

const MovieCard = ({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home); // Get the URL configuration from the Redux store
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  // Memoize favoriteMedia to avoid unnecessary recalculations when user.favoriteMedia changes.
  const favoriteMedia = useMemo(
    () => user?.favoriteMedia || [],
    [user?.favoriteMedia]
  );
  // Determine the URL for the poster image, using a fallback if necessary
  const posterUrl = data.poster_path
    ? url.poster + data.poster_path
    : PosterFallback;

  // Check if the movie is in the user's favorite media.
  const isFavorite = favoriteMedia.some((media) => media.id === data.id);

  const handleLike = async (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent div
    if (isFavorite) {
      dispatch(removeFavorite(data));
      await removeFavoriteMediaFromFirestore(user.uid, data.id); // Remove favorite media from Firestore.
    } else {
      dispatch(addFavorite(data));
      await updateFavoriteMediaInFirestore(user.uid, data); // Update favorite media in Firestore.
    }
  };

  return (
    <div
      className="movieCard"
      onClick={() =>
        navigate(
          `/${data?.mediaType || data?.media_type || mediaType}/${data?.id}` //data?.mediaType if data comes from details page, data?.media_type if data comes from other pages
        )
      }
    >
      <div className="posterBlock">
        <Img className="posterImg" src={posterUrl} />
        {!fromSearch && (
          <React.Fragment>
            {/* Display circle rating and genres if not from search */}
            <CircleRating rating={data?.vote_average?.toFixed(1)} />
            <Genres data={data?.genre_ids?.slice(0, 2)} />
          </React.Fragment>
        )}
        {user.uid && ( // Display the heart button if the user is logged in.
          <button
            className={`heartButton ${isFavorite ? "liked" : ""}`}
            onClick={handleLike}
          >
            {isFavorite ? "❤️" : "♡"}
          </button>
        )}
      </div>
      <div className="textBlock">
        <span className="title">{data?.title || data?.name}</span>
        <span className="date">
          {dayjs(data?.release_date).format("MMM D, YYYY")}
        </span>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  data: PropTypes.object, // Validate `data` prop as an object
  fromSearch: PropTypes.bool, // Validate `fromSearch` prop as a boolean
  mediaType: PropTypes.string, // Validate `mediaType` prop as a string
};

export default MovieCard;
