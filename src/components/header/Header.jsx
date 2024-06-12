import { useState, useEffect, useCallback } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";

import "./style.scss";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movie-logo.png";

const Header = () => {
  const [show, setShow] = useState("top"); // Controls the visibility of the header
  const [lastScrollY, setLastScrollY] = useState(0); // Keeps track of the last scroll position
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Indicates if the mobile menu is open
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(""); // Controls the visibility of the search bar
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the current location

  // Function to control the header visibility and the appearance of the navbar based on scrolling
  // Memoize controlNavbar to prevent re-creation on every render
  const controlNavbar = useCallback(() => {
    if (window.scrollY > 200) {
      if (window.scrollY > lastScrollY && !mobileMenuOpen) {
        setShow("hide");
      } else {
        setShow("show");
      }
    } else {
      setShow("top");
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY, mobileMenuOpen]); // Only re-create controlNavbar if lastScrollY and mobileMenuOpen changes

  // Effect to scroll to the top when the location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Add event listener for scrolling and remove it on component unmount
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  // Handler for header search query input
  const seachQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };

  // Handler to open the search bar
  const openSearch = () => {
    setMobileMenuOpen(false);
    setShowSearch(true);
  };

  // Handler to open the mobile menu
  const openMobileMenu = () => {
    setMobileMenuOpen(true);
    setShowSearch(false);
  };

  // Handler for navigation items
  const navigationHandler = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`header ${mobileMenuOpen ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <>
          <div className="logo" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" />
            <span>Movie Recommender</span>
          </div>
          {/* Desktop menu */}
          <ul className="menuItems">
            <li className="menuItem" onClick={() => navigationHandler("movie")}>
              Movies
            </li>
            <li className="menuItem" onClick={() => navigationHandler("tv")}>
              TV Shows
            </li>
            <li className="menuItem">
              <HiOutlineSearch onClick={openSearch} />
            </li>
          </ul>
          {/* Mobile menu */}
          <div className="mobileMenuItems">
            <HiOutlineSearch onClick={openSearch} />
            {mobileMenuOpen ? (
              <VscChromeClose onClick={() => setMobileMenuOpen(false)} />
            ) : (
              <SlMenu onClick={openMobileMenu} />
            )}
          </div>
        </>
      </ContentWrapper>
      {/* Search bar */}
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search for a movie or tv show..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyUp={seachQueryHandler}
              />
              <VscChromeClose onClick={() => setShowSearch(false)} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
