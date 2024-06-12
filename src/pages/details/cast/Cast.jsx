import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Img from "../../../components/lazyLoadImage/Img";
import avatar from "../../../assets/avatar.png"; // Fallback avatar image

// Cast component to display the cast members
const Cast = ({ data, loading }) => {
  // Selecting the base URL from the Redux store
  const { url } = useSelector((state) => state.home);

  // Skeleton loader component to show while data is loading
  const skeleton = () => {
    return (
      <div className="skItem">
        <div className="circle skeleton"></div>
        <div className="row skeleton"></div>
        <div className="row2 skeleton"></div>
      </div>
    );
  };
  return (
    <div className="castSection">
      <ContentWrapper>
        <div className="sectionHeading">Top Cast</div>
        {!loading ? (
          data && data.length > 0 ? (
            <div className="listItems">
              {data?.map((item) => {
                // Determine the image URL for the cast member
                let imgUrl = item.profile_path
                  ? url.profile + item.profile_path
                  : avatar;
                return (
                  <div key={item.id} className="listItem">
                    <div className="profileImg">
                      <Img src={imgUrl} />
                    </div>
                    <div className="name">{item.name}</div>
                    <div className="character">{item.character}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="noCastFound">No cast found!</div>
          )
        ) : (
          // If loading, display skeleton loaders
          <div className="castSkeleton">
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
            {skeleton()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

Cast.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object), // Validate `data` prop as an array of objects
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]), // Validate `loading` prop as a boolean or string
};

export default Cast;
