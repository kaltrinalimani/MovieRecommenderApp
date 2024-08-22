import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";
import TmdbLogo from "../../assets/tmdb_long.svg";

import "./style.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <ul className="menuItems">
          <li className="menuItem">Terms Of Use</li>
          <li className="menuItem">Privacy-Policy</li>
          <li className="menuItem">About</li>
          <li className="menuItem">Blog</li>
          <li className="menuItem">FAQ</li>
        </ul>
        <div className="socialIcons">
          <span className="icon">
            <FaFacebookF />
          </span>
          <span className="icon">
            <FaInstagram />
          </span>
          <span className="icon">
            <FaLinkedin />
          </span>
        </div>
        <div className="tmdbLogo">
          <a href="https://www.themoviedb.org" target="_blank">
            <img src={TmdbLogo} alt="tmdb-logo" />
          </a>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
