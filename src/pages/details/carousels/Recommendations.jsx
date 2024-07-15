import PropTypes from "prop-types";
import Carousel from "../../../components/carousel/Carousel";
import "./style.scss";
import { useSelector } from "react-redux";
const Recommendations = ({ mediaType, similarMedia }) => {
  const allDataLoading = useSelector((state) => state.home.allDataLoading);

  if (allDataLoading) {
    return <div>Loading recommendations...</div>;
  }

  return (
    <div className="recommendationsSection">
      <>
        {similarMedia?.length === 0 ? (
          <div className="noDataSection">
            <div className="sectionHeading">Recommendations</div>
            <div className="noRecommendationsFound">
              No recommendations found!
            </div>
          </div>
        ) : (
          <Carousel
            title="Recommendations"
            data={similarMedia}
            loading={false}
            endpoint={mediaType}
          />
        )}
      </>
    </div>
  );
};

Recommendations.propTypes = {
  mediaType: PropTypes.string.isRequired, // mediaType should be a string and is required
  similarMedia: PropTypes.arrayOf(PropTypes.object), // similarMedia should be an array of objects
};

export default Recommendations;
