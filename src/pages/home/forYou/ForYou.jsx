import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import Carousel from "../../../components/carousel/Carousel";
import useFetch from "../../../hooks/useFetch";

const ForYou = () => {
  const { data, loading } = useFetch(`/trending/all/week`);
  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">For You</span>
      </ContentWrapper>
      <Carousel data={data?.results} loading={loading} />
    </div>
  );
};

export default ForYou;
