import { SearchBar as DsfrSearchBar } from "@codegouvfr/react-dsfr/SearchBar";

interface SearchBarProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  onSearch: (queryToSearch: string) => void;
  onReset: () => void;
}

export function SearchBar({ query, onQueryChange, onSearch }: SearchBarProps) {
  return (
    <div className="fr-mb-4w" style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
      <div style={{ flex: 1 }}>
        <DsfrSearchBar
          label="Rechercher une commune par nom ou code postal"
          renderInput={({ id, type, className }) => (
            <input
              id={id}
              type={type}
              className={className}
              placeholder="Ex: Nantes, 44000, Paris, 69001..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearch(query);
                }
              }}
            />
          )}
          onButtonClick={(text) => onSearch(text || query)}
        />
      </div>
    </div>
  );
}

export default SearchBar;
