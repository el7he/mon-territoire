import { useState, useEffect } from "react";
import { searchCommunes } from "../api/geoapi";
import type { Commune } from "../domain/commune";

export function useCommune(codeInsee?: string) {
  const [communeInfo, setCommuneInfo] = useState<Commune | null>(null);

  useEffect(() => {
    if (!codeInsee) return;
    const controller = new AbortController();

    searchCommunes({ query: codeInsee, signal: controller.signal })
      .then((results) => {
        if (results.length > 0) setCommuneInfo(results[0]);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

    return () => controller.abort();
  }, [codeInsee]);

  return { communeInfo };
}