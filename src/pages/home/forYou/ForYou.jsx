import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Carousel from "../../../components/carousel/Carousel";

const ForYou = (recommendedMediaDetails) => {
  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">For You</span>
      </ContentWrapper>
      <Carousel data={recommendedMediaDetails.recommendedMediaDetails} />
    </div>
  );
};

export default ForYou;
