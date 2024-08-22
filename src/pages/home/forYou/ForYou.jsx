import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Carousel from "../../../components/carousel/Carousel";
import PropTypes from "prop-types";

const ForYou = ({ recommendedMediaDetails }) => {
  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">For You</span>
      </ContentWrapper>
      <Carousel data={recommendedMediaDetails} />
    </div>
  );
};

ForYou.propTypes = {
  recommendedMediaDetails: PropTypes.array,
};

export default ForYou;
