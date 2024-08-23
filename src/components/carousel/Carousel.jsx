import PropTypes from "prop-types";
import { useRef, useEffect } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import MovieCard from "../movieCard/MovieCard";

import "./style.scss";

const Carousel = ({ data, loading, endpoint, title, onLike }) => {
  const carouselContainer = useRef();

  const navigation = (dir) => {
    const container = carouselContainer.current; // Access the carousel container DOM element

    // Calculate the scroll amount based on the direction
    const scrollAmount =
      dir === "left"
        ? container.scrollLeft - (container.offsetWidth + 20)
        : container.scrollLeft + (container.offsetWidth + 20);

    container.scrollTo({ left: scrollAmount, behavior: "smooth" });
  };

  // Reset the scroll position to the leftmost position whenever the component mounts or data changes
  useEffect(() => {
    if (carouselContainer.current) {
      carouselContainer.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [data]);

  const skItem = () => {
    return (
      <div className="skeletonItem">
        <div className="posterBlock skeleton"></div>
        <div className="textBlock">
          <div className="title skeleton"></div>
          <div className="date skeleton"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="carousel">
      <ContentWrapper>
        {title && <div className="carouselTitle">{title}</div>}
        <BsFillArrowLeftCircleFill
          className="carouselLeftNav arrow"
          onClick={() => navigation("left")}
        />
        <BsFillArrowRightCircleFill
          className="carouselRighttNav arrow"
          onClick={() => navigation("right")}
        />
        {!loading ? (
          <div className="carouselItems" ref={carouselContainer}>
            {data?.map((item, index) => {
              return (
                <MovieCard
                  key={`${item.id}-${index}`} // Add a unique key to each item
                  data={item}
                  mediaType={item.media_type || endpoint}
                  onLike={() => onLike(item)}
                />
              );
            })}
          </div>
        ) : (
          <div className="loadingSkeleton">
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
            {skItem()}
          </div>
        )}
      </ContentWrapper>
    </div>
  );
};

Carousel.propTypes = {
  data: PropTypes.array, // data prop to be an array
  loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]), // loading prop to be a boolean or a string
  endpoint: PropTypes.string, // endpoint prop to be a string
  title: PropTypes.string, // Allow title prop to be a string
  onLike: PropTypes.func,
};

export default Carousel;
