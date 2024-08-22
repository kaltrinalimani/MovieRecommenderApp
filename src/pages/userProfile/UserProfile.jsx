import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MovieCard from "../../components/movieCard/MovieCard";
import { fetchAllDataOfMediaType } from "../../utils/api";
import { useEffect } from "react";
import { recommendFunction } from "../../utils/recommend";
import { fetchDataFromApi } from "../../utils/api";
import ForYou from "../home/forYou/ForYou";
import { useState } from "react";

const UserProfile = () => {
  const { mediaType } = useParams();
  const user = useSelector((state) => state.user.userData);
  const [recommendedMediaData, setRecommendedMediaData] = useState([]);

  const favoriteMediaList = useSelector(
    (state) => state.user.userData?.favoriteMedia
  );
  const combinedMedias = useSelector((state) => state.home.combinedMedias);

  useEffect(() => {
    const fetchAndComputeSimilarities = async () => {
      // Create a set of IDs from combinedMedias for efficient lookup
      const combinedMediaIds = new Set(combinedMedias.map((media) => media.id)); // Set(1119){278, 238, 240, 424, 389…}

      // Filter favoriteMediaList to get items that are not in combinedMedias
      const favoriteMediaNotInCombined = favoriteMediaList?.filter(
        (media) => !combinedMediaIds.has(media.id)
      );

      const processedMedia = await fetchAllDataOfMediaType(
        undefined,
        favoriteMediaNotInCombined,
        undefined,
        favoriteMediaNotInCombined
      );
      // Combine favorite media into a single place(attribute) combinedFeatures
      const combinedFavoriteMedia = {
        id: "combinedFavoriteId", // an arbitrary id for the combined favorite media
        combinedFeatures: processedMedia
          .map((media) => media.combinedFeatures)
          .reduce((acc, features) => acc.concat(features), []),
        mediaType: "mix", // a special media type indicating it's a combination of features in one place
      };
      // Add the combined favorite document to the combinedMedias array
      const allMediaTogether = [combinedFavoriteMedia, ...combinedMedias];
      // Use the recommend function to calculate similarities
      const recommendedMedia = recommendFunction(
        allMediaTogether,
        allMediaTogether[0].id
      );

      // Fetch details for the top similar media
      const recommendedMediaDetails = await Promise.all(
        recommendedMedia.map(async (media) => {
          const mediaDetails = await fetchDataFromApi(
            `/${media.mediaType}/${media.id}`
          );
          return { ...mediaDetails, mediaType: media.mediaType };
        })
      );

      setRecommendedMediaData(recommendedMediaDetails);
    };

    if (favoriteMediaList.length > 0) {
      fetchAndComputeSimilarities();
    }
  }, [favoriteMediaList, combinedMedias]);

  return (
    <div className="userProfilePage">
      <ContentWrapper>
        <div className="userProfileContainer">
          <div className="userProfileData">
            <span>Username: {user.displayName}</span>
            <span>Email: {user.email}</span>
          </div>
        </div>
        <h3 className="userfavoriteListTitle">My favorite media</h3>
        <div className="mediaListContainer">
          {favoriteMediaList.length > 0 ? (
            favoriteMediaList.map((item, index) => {
              return (
                <MovieCard
                  key={`${item.id}-${index}`} // Combine item id and index to ensure uniqueness
                  data={item}
                  mediaType={
                    mediaType || item.media_type || item.first_air_date
                      ? "tv"
                      : "movie"
                  }
                />
              );
            })
          ) : (
            <p>
              There isn&apos;t any media you liked yet! Please click the heart
              button if you like something you have seen!
            </p>
          )}
        </div>
        {favoriteMediaList.length > 0 && (
          <ForYou recommendedMediaDetails={recommendedMediaData} />
        )}
      </ContentWrapper>
    </div>
  );
};

export default UserProfile;
