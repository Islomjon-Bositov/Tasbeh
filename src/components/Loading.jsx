import "./Loading.css";

const Loading = ({ isDarkMode = true }) => {
  return (
    <div className={`loading-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="loader">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
      </div>
      <h2>Tasbih</h2>
    </div>
  );
};

export default Loading;
