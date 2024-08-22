import axios from "axios";
import { extractAttributes, removeDuplicates } from "./helper";

const BASE_URL = "https://api.themoviedb.org/3";
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

const headers = {
  Authorization: "bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
  try {
    const { data } = await axios.get(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

// Utility function to fetch all pages of data for a specific media type
export const fetchAllDataOfMediaType = async (
  mediaType,
  combinedMediasWithSelected,
  targetMediaInCorpus,
  favoriteMediaNotInCombined,
  minRating = 7.5,
  maxPages = 50 // for the filtering values below, i get results from only 165 of these many pages fetched
) => {
  let page = 1;
  let allData = [];
  let totalPages = 1;

  // it is called from app.jsx
  if (!combinedMediasWithSelected) {
    while (page <= totalPages && page <= maxPages) {
      const data = await fetchDataFromApi(`/${mediaType}/top_rated`, { page });
      if (data.results) {
        // Filter results based on the rating and original language to reduce data size
        const filteredResults = data.results
          .filter(
            (movie) =>
              movie.vote_average > minRating &&
              movie.original_language === "en" &&
              movie.overview // Ensure overview is not null or undefined
          )
          .map((movie) => extractAttributes(movie, mediaType)); // Extract relevant attributes and preprocess text overview and title data

        allData = [...allData, ...filteredResults];
        totalPages = data.total_pages;
        page++;
      } else {
        break; // Exit the loop if no results are returned
      }
      allData = removeDuplicates(allData);
    }
  }
  // if there are no selected media in corpus. It is called from details component or profile component
  else {
    // called from details component
    if (!favoriteMediaNotInCombined) {
      const mediaInCorpus = combinedMediasWithSelected.find(
        (media) => media.id === targetMediaInCorpus?.id
      );
      if (!mediaInCorpus) {
        combinedMediasWithSelected[0] = extractAttributes(
          combinedMediasWithSelected[0],
          mediaType
        );
        allData = [...combinedMediasWithSelected];
      } else {
        // media is in corpus
        allData = combinedMediasWithSelected; // return as is because combinedMediasWithSelected are treated before when called from app.jsx in the if statement above
      }
    } else {
      // called from UserProfile to recommend movies based on favorite Media List
      const favoriteMediaNotInCombinedArr = favoriteMediaNotInCombined.map(
        (media) => extractAttributes(media, media.mediaType)
      );
      allData = favoriteMediaNotInCombinedArr;
    }
  }
  return allData;
};
