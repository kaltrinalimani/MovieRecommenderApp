import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MovieCard from "../../components/movieCard/MovieCard";

const UserProfile = () => {
  const { mediaType } = useParams();
  const user = useSelector((state) => state.user.userData);

  const favoriteMediaList = useSelector(
    (state) => state.user.userData?.favoriteMedia
  );
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
                  key={index}
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
      </ContentWrapper>
    </div>
  );
};

export default UserProfile;
