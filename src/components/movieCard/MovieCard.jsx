import React from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import "./style.scss";
import Img from "../lazyLoadImage/Img";
import CircleRating from "../circleRating/CircleRating";
import Genres from "../genres/Genres";
import PosterFallback from "../../assets/no-poster.png";

const MovieCard = ({ data, fromSearch, mediaType }) => {
  const { url } = useSelector((state) => state.home); // Get the URL configuration from the Redux store
  const navigate = useNavigate();
  // Determine the URL for the poster image, using a fallback if necessary
  const posterUrl = data.poster_path
    ? url.poster + data.poster_path
    : PosterFallback;
  return (
    <div
      className="movieCard"
      onClick={() => navigate(`/${data?.media_type || mediaType}/${data?.id}`)}
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
