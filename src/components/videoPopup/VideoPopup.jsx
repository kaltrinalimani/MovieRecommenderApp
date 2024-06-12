import ReactPlayer from "react-player/youtube";
import PropTypes from "prop-types";

import "./style.scss";

const VideoPopup = ({ show, setShow, videoId, setVideoId }) => {
  const hidePopup = () => {
    setShow(false);
    setVideoId(null);
  };
  return (
    // Conditionally apply the "visible" class based on the 'show' prop to toggle visibility
    <div className={`videoPopup ${show ? "visible" : ""}`}>
      {/* Overlay layer to close the popup when clicked */}
      <div className="opacityLayer" onClick={hidePopup}></div>
      <div className="videoPlayer">
        <span className="closeBtn" onClick={hidePopup}>
          Close
        </span>
        {/* ReactPlayer component to play YouTube videos */}
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${videoId}`}
          controls
          width="100%"
          height="100%"
          // playing={true}
          onError={(e) => console.error("ReactPlayer Error:", e)}
        />
      </div>
    </div>
  );
};

VideoPopup.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
  videoId: PropTypes.string,
  setVideoId: PropTypes.func.isRequired,
};

export default VideoPopup;
