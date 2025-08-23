import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * React entry point
 * Mounts the <App /> component inside the #root element.
 * Wraps the app in StrictMode for highlighting potential issues.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
