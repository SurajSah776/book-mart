import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { UserProvider } from "./context/UserContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      {" "}
      <Router>
        <App />
      </Router>
    </UserProvider>
  </StrictMode>
);
