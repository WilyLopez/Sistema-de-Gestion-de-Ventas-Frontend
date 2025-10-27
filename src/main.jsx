// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@context/ThemeContext";
import { AuthProvider } from "@context/AuthContext";
import { SoundProvider } from "@context/SoundContext";
import { NotificationProvider } from "@context/NotificationContext"; 
import App from "./App";

import "./index.css";
import "./styles/globals.css";
import "./styles/animations.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SoundProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>
          </SoundProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
