import PropTypes from "prop-types";
import Carousel from "../../../components/carousel/Carousel";
import useFetch from "../../../hooks/useFetch";
import "./style.scss";

const Recommendations = ({ mediaType, id }) => {
  const { data, loading } = useFetch(`/${mediaType}/${id}/recommendations`);
  // [{}, {}] data.results -> data should be an array with objects

  return (
    <div className="recommendationsSection">
      <>
        {!data?.results || data?.results.length === 0 ? (
          <div className="noDataSection">
            <div className="sectionHeading">Recommendations</div>
            <div className="noRecommendationsFound">
              No recommendations found!
            </div>
          </div>
        ) : (
          <Carousel
            title="Recommendations"
            data={data?.results}
            loading={loading}
            endpoint={mediaType}
          />
        )}
      </>
    </div>
  );
};

Recommendations.propTypes = {
  mediaType: PropTypes.string.isRequired, // mediaType should be a string and is required
  id: PropTypes.string.isRequired, // id should be a string and is required
};

export default Recommendations;
