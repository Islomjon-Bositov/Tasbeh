import { useState, useEffect } from "react";
import Tasbih from "./components/Tasbih";
import Loading from "./components/Loading";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return <main className="app">{loading ? <Loading /> : <Tasbih />}</main>;
}

export default App;
