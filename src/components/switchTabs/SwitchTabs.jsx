import PropTypes from "prop-types";
import "./style.scss";
import { useEffect, useState } from "react";

const SwitchTabs = ({ data, onTabChange, selectedTab }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    setLeft(selectedTab * 100);
  }, [selectedTab]);

  const activeTab = (tab, index) => {
    setLeft(index * 100);
    setTimeout(() => {
      onTabChange(tab, index);
    }, 300);
  };

  return (
    <div className="switchingTabs">
      <div className="tabItems">
        {data.map((tab, index) => (
          <span
            key={index}
            className={`tabItem ${selectedTab === index ? "active" : ""} `}
            onClick={() => activeTab(tab, index)}
          >
            {tab}
          </span>
        ))}
        <span className="movingBg" style={{ left: `${left}px` }} />
      </div>
    </div>
  );
};

// Define propTypes
SwitchTabs.propTypes = {
  data: PropTypes.array.isRequired, // Require data prop to be an array
  onTabChange: PropTypes.func.isRequired, // Require onTabChange prop to be a function
  selectedTab: PropTypes.number,
};

export default SwitchTabs;
