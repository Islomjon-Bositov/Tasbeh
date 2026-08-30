import { useEffect, useState } from "react";
import Tasbih from "./components/Tasbih";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("tasbih_isDarkMode") !== "false";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const syncTheme = () => {
      try {
        const value = localStorage.getItem("tasbih_isDarkMode");
        setIsDarkMode(value === null ? true : value === "true");
      } catch {
        setIsDarkMode(true);
      }
    };

    syncTheme();
  }, []);

  return (
    <main
      className={`app ${isDarkMode ? "theme-dark" : "theme-light"}`}
      aria-label="Tasbih counter app"
    >
      <Tasbih />
    </main>
  );
}

export default App;
