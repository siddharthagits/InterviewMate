import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { InterviewProvider } from "./context/InterviewContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <InterviewProvider>
          <App />
        </InterviewProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);