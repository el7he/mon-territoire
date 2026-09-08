import React from "react";

interface SearchBarProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function SearchBar({ query, onQueryChange, onSearch, onReset }: SearchBarProps) {
  return (
    <form
      role="search"
      className="fr-search-bar fr-mb-4w"
      id="search-commune-bar"
      onSubmit={onSearch}
    >
      <label className="fr-label" htmlFor="search-commune-input">
        Rechercher une commune par nom ou code postal
      </label>
      <input
        className="fr-input"
        placeholder="Ex: Nantes, 44000, Paris, 69001..."
        type="search"
        id="search-commune-input"
        name="search-commune-input"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Rechercher une commune par nom ou par code postal"
      />
      <button className="fr-btn" title="Rechercher" type="submit" id="search-submit-btn">
        Rechercher
      </button>

      {query.length > 0 && (
        <button
          type="button"
          className="fr-btn fr-btn--tertiary fr-ml-2w"
          onClick={onReset}
          title="Effacer la recherche"
          id="search-reset-btn"
        >
          Effacer
        </button>
      )}
    </form>
  );
}

export default SearchBar;
