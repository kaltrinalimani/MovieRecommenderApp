import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import noResults from "../../assets/no-results.png";

const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams(); // Get search query from URL parameters

  // Memoize fetchInitialData to prevent re-creation on every render
  const fetchInitialData = useCallback(() => {
    setLoading(true); // Set loading state to true to show spinner
    fetchDataFromApi(`/search/multi?query=${query}&page=1`).then((res) => {
      setData(res);
      setPageNum((prev) => prev + 1); // Increment page number for subsequent fetches
      setLoading(false); // Set loading state to false to hide spinner
    });
  }, [query]);

  // Function to fetch next page of search results
  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          // Update data by appending new results to existing results
          setData((prevData) => ({
            ...prevData,
            results: [...(prevData?.results || []), ...res.results],
          }));
        } else {
          setData(res); // If no previous results, just set the new data
        }
        setPageNum((prev) => prev + 1); // Increment page number for subsequent fetches
      }
    );
  };

  // useEffect to fetch initial data when query changes
  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query, fetchInitialData]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? ( // Check if there are any search results
            <>
              <div className="pageTitle">
                {`Search ${
                  data?.total_results > 1 ? "results" : "result"
                } of '${query}'`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard
                      key={`${item.id}-${index}`} // Combine item id and index to ensure uniqueness
                      data={item}
                      fromSearch={true}
                    />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <div className="resultNotFound">
              <span className="textNotFound">Sorry, Results not found!</span>
              <img src={noResults} />
            </div>
          )}
        </ContentWrapper>
      )}
      ;
    </div>
  );
};

export default SearchResult;
