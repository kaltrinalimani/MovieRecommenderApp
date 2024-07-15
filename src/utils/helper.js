import { preprocessText } from "./preProcessData";

export const removeDuplicates = (data) => {
  const uniqueIds = new Set();
  return data.filter((item) => {
    if (uniqueIds.has(item.id)) {
      return false;
    } else {
      uniqueIds.add(item.id);
      return true;
    }
  });
};

export const extractAttributes = (media, mediaType) => {
  // Preprocess title or name and overview
  const titleOrName = media?.title || media?.name;
  const preprocessedTitleOrName = preprocessText(titleOrName);
  const preprocessedOverview = preprocessText(media?.overview);

  // Combine the preprocessed title/name and overview
  const combinedFeatures = [
    ...preprocessedTitleOrName,
    ...preprocessedOverview,
  ];

  return {
    id: media?.id,
    title: media?.title || media?.name,
    backdrop_path: media?.backdrop_path,
    poster_path: media?.poster_path,
    genres: media?.genre_ids,
    combinedFeatures,
    overview: preprocessText(media?.overview),
    vote_average: media?.vote_average,
    release_date: media?.release_date || media?.first_air_date,
    mediaType: mediaType || media?.mediaType,
  };
};

export const filterResults = (data, minRating = 7.5) => {
  const filteredResults = data?.filter(
    (media) =>
      media.vote_average > minRating &&
      media.original_language === "en" &&
      media.overview // Ensure overview is not null or undefined
  );
  return filteredResults;
};
