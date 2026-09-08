import { useState, useEffect, type FormEvent } from 'react';

interface AdministrationRecord {
  code_insee_commune?: string;
  nom_commune?: string;
  id_service_local?: string;
  code_type_service_local?: string;
}
interface ApiResponse {
  total_count: number;
  results: AdministrationRecord[];
}

function parseServiceIds(idString?: string): string[] {
  if (!idString) return [];
  try {
    const parsed = JSON.parse(idString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AnnuaireSearch() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchCode, setSearchCode] = useState<string>('');
  const [activeSearch, setActiveSearch] = useState<{ term: string; code: string }>({ term: '', code: '' });
  const [limit, setLimit] = useState<number>(10);

  const [data, setData] = useState<AdministrationRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const baseUrl = 'https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration-locale-competence-geographique/records';
      let url = `${baseUrl}?limit=${limit}`;

      const conditions: string[] = [];

      // Filtre par nom ou type de service
      if (activeSearch.term.trim()) {
        const cleanTerm = activeSearch.term.trim().replace(/"/g, '\\"');
        conditions.push(`(suggest(nom_commune, "${cleanTerm}") OR code_type_service_local LIKE "${cleanTerm}")`);
      }

      // Filtre par code INSEE
      if (activeSearch.code.trim()) {
        const cleanCode = activeSearch.code.trim().replace(/"/g, '\\"');
        conditions.push(`code_insee_commune LIKE "${cleanCode}"`);
      }

      if (conditions.length > 0) {
        url += `&where=${encodeURIComponent(conditions.join(' AND '))}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const json: ApiResponse = await response.json();
        setData(json.results || []);
        setTotalCount(json.total_count || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeSearch, limit]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActiveSearch({ term: searchTerm, code: searchCode });
  };

  return (
    <div>
      <h2>Recherche Administration</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Commune ou service..."
        />

        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="Code INSEE..."
        />

        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <button type="submit">Rechercher</button>
      </form>

      {loading && <p>Chargement...</p>}
      {error && <p>Erreur : {error}</p>}

      {!loading && !error && (
        <>
          <p>{totalCount} résultat(s)</p>
          <ul>
            {data.map((item, index) => {
              const serviceIds = parseServiceIds(item.id_service_local);
              return (
                <li key={index}>
                  <h3>{item.nom_commune || 'Inconnue'}</h3>
                  <p>Code INSEE : {item.code_insee_commune}</p>
                  <p>Type : {item.code_type_service_local}</p>
                  <p>Services ({serviceIds.length}) :</p>
                  <ul>
                    {serviceIds.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}