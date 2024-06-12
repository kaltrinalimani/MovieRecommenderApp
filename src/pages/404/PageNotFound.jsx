import "./style.scss";
import noResults from "../../assets/no-results.png";

const PageNotFound = () => {
  return (
    <div className="pageNotFound">
      <div className="text">Sorry, page not found!</div>
      <img src={noResults} />
    </div>
  );
};

export default PageNotFound;
