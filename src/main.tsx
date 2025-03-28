import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./rtl.css"; // Import RTL styles
// Import i18n configuration
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
