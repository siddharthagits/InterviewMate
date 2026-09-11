import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

function applyThemeToDOM(theme) {
  if (typeof document === "undefined") return;
  document.body.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light") {
    document.body.classList.add("light");
    document.body.classList.remove("dark");
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  } else {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("im-theme") : null;
    const initial = saved === "light" ? "light" : "dark";
    applyThemeToDOM(initial);
    return initial;
  });

  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem("im-theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      applyThemeToDOM(next);
      localStorage.setItem("im-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx || { theme: "dark", toggle: () => {} };
}
