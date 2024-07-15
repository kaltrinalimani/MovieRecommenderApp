import { useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchDataFromApi, fetchAllDataOfMediaType } from "./utils/api";
import { useDispatch } from "react-redux";
import {
  getApiConfiguration,
  getGenres,
  setAllDataLoading,
  setCombinedMedias,
} from "./store/homeSlice";
import { auth } from "./firebase";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import LogIn from "./pages/logIn/LogIn";
import UserProfile from "./pages/userProfile/UserProfile";
import PageNotFound from "./pages/404/PageNotFound";
import { setLoading, setFavoriteMedia } from "./store/userSlice";
import { fetchFavoriteMediaFromFirestore } from "./firestore";

function App() {
  // Hook to access the dispatch function from the Redux store
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      // Listener for authentication state changes
      if (authUser) {
        // If a user is authenticated
        fetchFavoriteMediaFromFirestore(authUser.uid) // Fetch the user's favorite media from Firestore
          .then((favoriteMedia) => {
            const updatedFavoriteMedia = favoriteMedia.map((media) => {
              if (media.first_air_date) {
                // Add mediaType attribute if first_air_date exists because only tv shows have first_air_date
                return { ...media, mediaType: "tv" };
              }
              return media;
            });
            dispatch(setFavoriteMedia(updatedFavoriteMedia)); // Update the Redux store with the fetched favorite media
            dispatch(setLoading(false));
          })
          .catch((error) => {
            // Handle any errors that occur during the fetch
            console.error("Error fetching favorite media:", error);
          });
      } else {
        // If no user is authenticated
        dispatch(setLoading(false));
      }
    });
    // Return a cleanup function that unsubscribes from the auth state listener
    return () => unsubscribe();
  }, [dispatch]);

  // Function to fetch API configuration data
  // useCallback is used to memoize the function, ensuring it is not recreated on every render
  const fetchApiConfig = useCallback(() => {
    fetchDataFromApi("/configuration").then((res) => {
      //Construct Base url for backdrop, poster and profile image. In this we will append later another url to get the image.
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };
      // Dispatch the API configuration to the Redux store
      dispatch(getApiConfiguration(url));
    });
  }, [dispatch]); // Dependency array to ensure fetchApiConfig is memoized based on the dispatch function

  // Asynchronous function to fetch genre data for TV shows and movies
  // useCallback is used to memoize the function, ensuring it is not recreated on every render
  const genresCall = useCallback(async () => {
    let promises = [];
    let endpoints = ["tv", "movie"];
    let allGenres = {};
    // Create promises for each endpoint and add to the promises array
    endpoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });
    // Wait for all promises to resolve and store the results in 'data'
    const data = await Promise.all(promises);
    // Map through the results and accumulate genres into 'allGenres' object
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });
    // Dispatch the accumulated genres to the store
    dispatch(getGenres(allGenres));
  }, [dispatch]); // Dependency array to ensure genresCall is memoized based on the dispatch function

  // Fetch all media(top rated movies/tvs and combine them) and store them in Redux state. Only some of the Top-rated because the api has a lot of data and takes too long to load them all. This is only to demonstrate the content based filtering algorithm.
  const fetchAllMedia = useCallback(async () => {
    dispatch(setAllDataLoading(true));
    const movies = await fetchAllDataOfMediaType("movie");
    const tvs = await fetchAllDataOfMediaType("tv");
    const combinedMedias = [...movies, ...tvs];
    dispatch(setCombinedMedias(combinedMedias));
    dispatch(setAllDataLoading(false));
  }, [dispatch]);

  //Run the fetchApiConfig, genresCall, fetchAllMedia functions when the component mounts
  useEffect(() => {
    fetchApiConfig();
    genresCall();
    fetchAllMedia();
  }, [fetchApiConfig, genresCall, fetchAllMedia]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="/logIn" element={<LogIn />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
