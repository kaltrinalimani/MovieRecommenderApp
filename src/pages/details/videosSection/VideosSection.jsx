import { useState } from "react";
import PropTypes from "prop-types";
import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import VideoPopup from "../../../components/videoPopup/VideoPopup";
import Img from "../../../components/lazyLoadImage/Img";
import { PlayIcon } from "../Playbtn";

// VideosSection component displays a list of official videos.
const VideosSection = ({ data, loading }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);

  // Skeleton loading template for when videos are loading.
  const loadingSkeleton = () => {
    return (
      <div className="skItem">
        <div className="thumb skeleton"></div>
        <div className="row skeleton"></div>
        <div className="row2 skeleton"></div>
      </div>
    );
  };

  return (
    <div className="videosSection">
      <ContentWrapper>
        <div className="sectionHeading">Official Videos</div>
        {!loading ? (
          data && data.length > 0 ? (
            <div className="videos">
              {/* Map through each video in the data results */}
              {data?.map((video) => (
                <div
                  key={video.id}
                  className="videoItem"
                  onClick={() => {
                    setVideoId(video.key);
                    setShow(true);
                  }}
                >
                  <div className="videoThumbnail">
                    <Img
                      src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                    />
                    <PlayIcon />
                  </div>
                  <div className="videoTitle">{video.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="noVideosFound">No videos found!</div>
          )
        ) : (
          // If videos are loading, display loading skeleton
          <div className="videoSkeleton">
            {loadingSkeleton()}
            {loadingSkeleton()}
            {loadingSkeleton()}
            {loadingSkeleton()}
          </div>
        )}
      </ContentWrapper>
      {/* VideoPopup component to display selected video */}
      <VideoPopup
        show={show}
        setShow={setShow}
        videoId={videoId}
        setVideoId={setVideoId}
      />
    </div>
  );
};

VideosSection.propTypes = {
  data: PropTypes.array, // Validate `data` prop as an array
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]), // Validate `loading` prop as a boolean or string
};

export default VideosSection;
