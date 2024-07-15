import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import DetailsBanner from "./detailsBanner/DetailsBanner";
import Cast from "./cast/Cast";
import VideosSection from "./videosSection/VideosSection";
import Recommendations from "./carousels/Recommendations";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllDataOfMediaType } from "../../utils/api";
import { fetchDataFromApi } from "../../utils/api";
import { recommendFunction } from "../../utils/recommend";

const Details = () => {
  const user = useSelector((state) => state.user.userData);
  const { mediaType, id } = useParams(); // Extract mediaType and id parameters from the URL
  const { data, loading } = useFetch(`/${mediaType}/${id}/videos`); // Fetch video data for the specific media item
  // Fetch credits data (cast and crew) for the specific media item
  const { data: credits, loading: creditsLoading } = useFetch(
    `/${mediaType}/${id}/credits`
  );
  const combinedMedias = useSelector((state) => state.home.combinedMedias);
  const { data: selectedMedia, loading: selectedMediaLoading } = useFetch(
    `/${mediaType}/${id}`
  ); // Fetching the detailed data of the media item selected
  const [similarMedia, setSimilarMedia] = useState([]);

  useEffect(() => {
    const fetchAndComputeSimilarities = async () => {
      const targetMediaId = parseInt(id);
      const targetMediaInCorpus = combinedMedias.find(
        (media) => media.id === targetMediaId
      );

      let mediaToProcess = combinedMedias;
      if (!targetMediaInCorpus && selectedMedia) {
        mediaToProcess = [selectedMedia, ...combinedMedias];
      }
      const allMediaTogether = await fetchAllDataOfMediaType(
        mediaType,
        mediaToProcess,
        targetMediaInCorpus
      );
      const similarities = recommendFunction(allMediaTogether, targetMediaId);
      // Fetch details for the top similar media
      const similarMediaDetails = await Promise.all(
        similarities.map(async (media) => {
          const mediaDetails = await fetchDataFromApi(
            `/${media.mediaType}/${media.id}`
          );
          return { ...mediaDetails, mediaType: media.mediaType };
        })
      );

      setSimilarMedia(similarMediaDetails);
    };

    if (!selectedMediaLoading && selectedMedia && combinedMedias.length > 0) {
      fetchAndComputeSimilarities();
    }
  }, [combinedMedias, id, mediaType, selectedMedia, selectedMediaLoading]);

  return (
    <div>
      <DetailsBanner video={data?.results?.[0]} crew={credits?.crew} />
      <Cast data={credits?.cast} loading={creditsLoading} />
      <VideosSection data={data?.results} loading={loading} />
      {user.uid && (
        <Recommendations
          mediaType={mediaType}
          // id={id}
          similarMedia={similarMedia}
        />
      )}
    </div>
  );
};

export default Details;
