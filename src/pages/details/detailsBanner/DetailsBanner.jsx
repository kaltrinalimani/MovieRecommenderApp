import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../../../store/userSlice.js";
import dayjs from "dayjs";
import PropTypes from "prop-types";

import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbtn.jsx";
import VideoPopup from "../../../components/videoPopup/VideoPopup.jsx";

// Component to display detailed information about a media item
const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false); // State to control the visibility of the video popup
  const [videoId, setVideoId] = useState(null); // State to store the current video ID
  const { mediaType, id } = useParams(); // Extracting mediaType and id from the URL parameters
  const { data, loading } = useFetch(`/${mediaType}/${id}`); // Fetching the detailed data of the media item
  const { url } = useSelector((state) => state.home);
  const _genres = data?.genres?.map((g) => g.id);
  const director = crew?.filter((f) => f.job === "Director"); // Filtering the crew to get directors
  // Filtering the crew to get writers
  const writer = crew?.filter(
    (f) => f.job === "Screenplay" || f.job === "Writer"
  );

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userData);
  const favoriteMedia = useSelector(
    (state) => state.user.userData?.favoriteMedia
  );

  const isFavorite = favoriteMedia.some((media) => media.id === data?.id);
  const handleLike = (e) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent div
    if (isFavorite) {
      dispatch(removeFavorite(data));
    } else {
      dispatch(addFavorite(data));
    }
  };

  // Function to convert runtime from minutes to hours and minutes
  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!data && ( // Conditional rendering if data is available
            <React.Fragment>
              {/* Background image of the banner */}
              <div className="backdrop-img">
                <Img src={url.backdrop + data?.backdrop_path} />
              </div>
              {/* Overlay for background image */}
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  {/* Left section containing the poster image */}
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  {/* Right section containing the detailed information */}
                  <div className="right">
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data?.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{data.tagline}</div>
                    <Genres data={_genres} />
                    <div className="row">
                      {user.uid && ( //Display the heart button if the user is logged in.
                        <button
                          className={`heartButton ${isFavorite ? "liked" : ""}`}
                          onClick={handleLike}
                        >
                          {isFavorite ? "❤️" : "♡"}
                        </button>
                      )}
                      <CircleRating rating={data?.vote_average?.toFixed(1)} />
                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true);
                          setVideoId(video?.key);
                        }}
                      >
                        <PlayIcon />
                        <span className="text">Watch Trailer</span>
                      </div>
                    </div>
                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data.overview}</div>
                    </div>
                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {data.release_date && (
                        <div className="infoItem">
                          <span className="text bold">Release Date: </span>
                          <span className="text">
                            {dayjs(data.release_date).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime > 0 && (
                        <div className="infoItem">
                          <span className="text bold">Runtime: </span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director: </span>
                        <span className="text">
                          {director?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer: </span>
                        <span className="text">
                          {writer?.map((w, i) => (
                            <span key={i}>
                              {w.name}
                              {writer.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator: </span>
                        <span className="text">
                          {data?.created_by?.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data?.created_by?.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Video popup component to display the video trailer */}
                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        // Skeleton loader for the banner details
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

DetailsBanner.propTypes = {
  video: PropTypes.object,
  crew: PropTypes.arrayOf(PropTypes.object),
};

export default DetailsBanner;
