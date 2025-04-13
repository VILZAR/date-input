import { useState } from "react";
import Dates from "./Components/Dates";


function App() {
  const [theme, setTheme] = useState("light");

  const switcher  = () => {
    theme === 'light' ? setTheme('dark'): setTheme('light');
  }

  return (
    <div className={theme + ' theme'}>
      <label className="switcher">
        <input type="checkbox" onClick={switcher}/>
        <span className="slider"></span>
      </label>
      <header className="main-header">
        <h1 className="main-header__title">
          {theme === "light" ? "Светлая тема" : "Темная тема"}
        </h1>
      </header>
      <main>
        <Dates/>
      </main>
    </div>
  );
}

export default App;
