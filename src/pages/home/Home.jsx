// This style file is to style the title and tabs before each carousel items in home page.
// The css classes from this file are located inside Trending, Popular and TopRated components.
import "./style.scss";
import HeroBanner from "./heroBanner/HeroBanner";
import Trending from "./trending/Trending";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";
import ForYou from "./forYou/ForYou";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.user.userData);
  return (
    <div className="homePage">
      <HeroBanner />
      {user.uid && <ForYou />}
      <Trending />
      <Popular />
      <TopRated />
    </div>
  );
};

export default Home;
