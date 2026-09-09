import { useState, useEffect, useRef } from "react";
import { SearchBar as DsfrSearchBar } from "@codegouvfr/react-dsfr/SearchBar";
import { searchCommunes } from "../api/geoapi";
import type { Commune } from "../domain/commune";

interface SearchBarProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  onSearch: (queryToSearch: string) => void;
  onSelectCommune?: (commune: Commune) => void;
  onReset: () => void;
}

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  onSelectCommune,
}: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Écouteur pour fermer les suggestions quand on clique en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Déclenchement de la recherche d'autocomplétion
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      setIsOpen(false);
      return;
    }

    setIsLoadingSuggestions(true);
    setSelectedIndex(-1);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(() => {
      searchCommunes({ query: trimmedQuery, limit: 6, signal: controller.signal })
        .then((results) => {
          setSuggestions(results);
          setIsLoadingSuggestions(false);
          setIsOpen(true);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setSuggestions([]);
            setIsLoadingSuggestions(false);
          }
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const handleSelect = (commune: Commune) => {
    onQueryChange(commune.nom);
    setIsOpen(false);
    if (onSelectCommune) {
      onSelectCommune(commune);
    } else {
      onSearch(commune.codeInsee);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else {
        setIsOpen(false);
        onSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fr-mb-4w"
      style={{ position: "relative", width: "100%" }}
    >
      <DsfrSearchBar
        label="Rechercher une commune par nom, code postal ou INSEE"
        renderInput={({ id, type, className }) => (
          <input
            id={id}
            type={type}
            className={className}
            placeholder="Ex: Nantes, 44000, Paris, 69001..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="autocomplete-list"
          />
        )}
        onButtonClick={(text) => {
          setIsOpen(false);
          onSearch(text || query);
        }}
      />

      {/* Menu d'autocomplétion des suggestions */}
      {isOpen && (
        <ul
          id="autocomplete-list"
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            margin: 0,
            padding: 0,
            listStyle: "none",
            backgroundColor: "var(--background-default-grey, #ffffff)",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
            border: "1px solid var(--border-default-grey, #dddddd)",
            borderRadius: "0 0 4px 4px",
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {isLoadingSuggestions && (
            <li
              style={{
                padding: "0.75rem 1rem",
                color: "var(--text-mention-grey, #666666)",
                fontStyle: "italic",
              }}
            >
              Recherche des communes...
            </li>
          )}

          {!isLoadingSuggestions && suggestions.length === 0 && (
            <li
              style={{
                padding: "0.75rem 1rem",
                color: "var(--text-mention-grey, #666666)",
              }}
            >
              Aucune commune trouvée pour "{query}"
            </li>
          )}

          {!isLoadingSuggestions &&
            suggestions.map((commune, index) => {
              const isSelected = index === selectedIndex;
              const postalCodesStr = commune.codesPostaux.slice(0, 3).join(", ");
              return (
                <li
                  key={commune.codeInsee + "-" + index}
                  role="option"
                  aria-selected={isSelected}
                  style={{
                    padding: "0.75rem 1rem",
                    cursor: "pointer",
                    backgroundColor: isSelected
                      ? "var(--background-open-blue-france, #e3e3fd)"
                      : "transparent",
                    borderBottom:
                      index < suggestions.length - 1
                        ? "1px solid var(--border-subtle-grey, #eeeeee)"
                        : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(commune);
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div>
                    <strong>{commune.nom}</strong>
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        color: "var(--text-mention-grey, #666666)",
                        fontSize: "0.9rem",
                      }}
                    >
                      ({postalCodesStr})
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-mention-grey, #666666)",
                    }}
                  >
                    {commune.departement}
                  </span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
