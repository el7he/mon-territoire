import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchByCommunes, type CommuneRecord } from "./api/annuaire";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { InitialState } from "./components/InitialState";
import { SearchBar } from "./components/SearchBar";

export function AnnuaireSearch() {
  const [query, setQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [records, setRecords] = useState<CommuneRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const abortRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim() === "") {
      abortRef.current?.abort();
      setSearchedQuery("");
      setRecords([]);
      setError(undefined);
    }
  };

  const handleSearch = async (searchQuery?: string) => {
    const cleanQuery = (typeof searchQuery === "string" ? searchQuery : query).trim();
    if (!cleanQuery) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSearchedQuery(cleanQuery);
    setLoading(true);
    setError(undefined);

    try {
      const result = await searchByCommunes(cleanQuery, controller.signal);
      setRecords(result.records);

      // Redirection directe vers DetailSheet si le résultat est unique
      if (result.records.length === 1 && result.records[0].code_insee_commune) {
        navigate(`/info/${result.records[0].code_insee_commune}`);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setQuery("");
    setSearchedQuery("");
    setRecords([]);
    setError(undefined);
    setLoading(false);
  };

  return (
    <section aria-labelledby="search-title">
      <h1 className="fr-h1" id="search-title">
        Consulter votre commune
      </h1>

      <SearchBar
        query={query}
        onQueryChange={handleQueryChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {loading && (
        <p className="fr-my-4w" role="status">
          Recherche en cours...
        </p>
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={() => handleSearch(searchedQuery)}
        />
      )}

      {!loading && !error && !searchedQuery && <InitialState />}

      {!loading && !error && searchedQuery && records.length === 0 && (
        <EmptyState query={searchedQuery} />
      )}

      {/* Si plusieurs communes correspondent à la recherche */}
      {!loading && !error && records.length > 1 && (
        <div className="fr-mt-4w">
          <p className="fr-text--bold">
            {records.length} résultats trouvés. Veuillez sélectionner une commune :
          </p>
          <div className="fr-grid-row fr-grid-row--gutters">
            {records.map((item, index) => (
              <div
                className="fr-col-12 fr-col-md-6 fr-col-lg-4"
                key={item.id_service_local || `${item.code_insee_commune}-${index}`}
              >
                <div className="fr-card fr-card--no-icon">
                  <div className="fr-card__body">
                    <div className="fr-card__content">
                      <h2 className="fr-card__title">
                        <button
                          type="button"
                          className="fr-btn fr-btn--tertiary-no-outline"
                          onClick={() => {
                            if (item.code_insee_commune) {
                              navigate(`/info/${item.code_insee_commune}`);
                            }
                          }}
                        >
                          {item.nom_commune || "Commune inconnue"}
                        </button>
                      </h2>
                      <p className="fr-card__desc">
                        Code INSEE : {item.code_insee_commune || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default AnnuaireSearch;