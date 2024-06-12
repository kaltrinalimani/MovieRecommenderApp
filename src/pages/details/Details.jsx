import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Recommendations from "./carousels/Recommendations";

const Details = () => {
  const { mediaType, id } = useParams(); // Extract mediaType and id parameters from the URL
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`); // Fetch video data for the specific media item
  // Fetch credits data (cast and crew) for the specific media item
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );
  return (
    <div>
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={data?.results} loading={loading} />
      <Recommendations mediaType={mediaType} id={id} />
    </div>
  );
};

export default Details;
