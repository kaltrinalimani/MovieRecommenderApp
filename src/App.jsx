import { useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";
import { useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";

function App() {
  // Hook to access the dispatch function from the Redux store
  const dispatch = useDispatch();

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

  //Run the fetchApiConfig and genresCall functions when the component mounts
  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, [fetchApiConfig, genresCall]);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
