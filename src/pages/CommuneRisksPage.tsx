// src/pages/CommuneRisksPage.tsx
import { useState, useRef } from 'react';
import { fetchCommuneRisks } from '../api/georisques';
import type { RiskSummary } from '../domain/risks';

export function CommuneRisksPage() {
  const [codeInsee, setCodeInsee] = useState('');
  const [summary, setSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!codeInsee.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchCommuneRisks({
        codeInsee: codeInsee.trim(),
        signal: controller.signal,
      });
      setSummary(result);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="insee">Code INSEE</label>
        <input
          id="insee"
          value={codeInsee}
          onChange={(e) => setCodeInsee(e.target.value)}
          placeholder="ex: 41194"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Recherche...' : 'Rechercher'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {summary && (
        <ul>
          {summary.risks.length === 0 && <li>Aucun risque recensé.</li>}
          {summary.risks.map((risk) => (
            <li key={risk.id}>
              <strong>{risk.type}</strong> — {risk.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}