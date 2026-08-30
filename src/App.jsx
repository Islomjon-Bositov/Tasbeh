import { useState, useEffect } from "react";
import Tasbih from "./components/Tasbih";
import Loading from "./components/Loading";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem("tasbih_isDarkMode") !== "false";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
    <main className={`app ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      {loading ? <Loading isDarkMode={isDarkMode} /> : <Tasbih />}
    </main>
  );
}

export default App;
