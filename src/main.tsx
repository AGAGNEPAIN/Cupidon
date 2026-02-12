import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TheaterProvider } from "./components/theater/TheaterProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TheaterProvider>
      <App />
    </TheaterProvider>
  </StrictMode>,
);
