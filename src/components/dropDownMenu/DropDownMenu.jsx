import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./style.scss";

const DropDownMenu = ({ onClose, onLogOut }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogOut();
    onClose();
  };

  const handleProfile = () => {
    navigate("/profile");
    onClose();
  };

  return (
    <div className="dropDownMenu">
      <ul>
        <li onClick={handleProfile}>Profile</li>
        <li onClick={handleLogout}>Log Out</li>
      </ul>
    </div>
  );
};

DropDownMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLogOut: PropTypes.func.isRequired,
};

export default DropDownMenu;
