// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import App from "./App";
import { CommuneRisksPage } from "./pages/CommuneRisksPage";

startReactDsfr({
  defaultColorScheme: "system",
  Link,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/risques" element={<CommuneRisksPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);