import React from "react";
import "@codegouvfr/react-dsfr/main.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import App from "./App";
import { CommuneRisksPage } from "./pages/CommuneRisksPage";
import { DetailSheet } from "./pages/DetailSheet";
import { NotFoundPage } from "./pages/NotFoundPage";

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
        <Route path="/info/:codeInsee" element={<DetailSheet />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);