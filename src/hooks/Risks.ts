import { useState, useEffect } from "react";
import { fetchCommuneRisks } from "../api/georisques";
import type { RiskSummary } from "../domain/risks.types";

export function useRisks(codeInsee?: string) {
  const [summary, setSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRisks = () => {
    if (!codeInsee) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setNotFound(false);
    setError(null);

    fetchCommuneRisks({ codeInsee, signal: controller.signal })
      .then((result) => {
        if (result.risks.length === 0) {
          setNotFound(true);
          return;
        }
        setSummary(result);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        if (err.message.includes("404")) {
          setNotFound(true);
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  };

  useEffect(() => {
    return loadRisks();
  }, [codeInsee]);

  return { summary, loading, notFound, error, retry: loadRisks };
}