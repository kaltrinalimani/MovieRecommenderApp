import "./style.scss";
import PropTypes from "prop-types";

const ContentWrapper = ({ children }) => {
  return <div className="contentWrapper">{children}</div>;
};

ContentWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element, // Single React element
    PropTypes.arrayOf(PropTypes.element), // Array of React elements
  ]).isRequired, // Ensure the children prop is always provided
};

export default ContentWrapper;
