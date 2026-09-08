import { useState } from "react";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { InitialState } from "./components/InitialState";
import { SearchBar } from "./components/SearchBar";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";

export type ViewState = "initial" | "loading" | "empty" | "error" | "success";

export function App() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ViewState>("initial");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim() === "") {
      setStatus("initial");
      setErrorMessage(undefined);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const q = (typeof searchQuery === "string" ? searchQuery : query).trim();
    if (!q) {
      setStatus("initial");
      return;
    }
    setStatus("empty");
  };

  const handleReset = () => {
    setQuery("");
    setStatus("initial");
    setErrorMessage(undefined);
  };

  return (
    <>
      <SkipLinks
        links={[
          {
            anchor: "#main-content",
            label: "Contenu",
          },
        ]}
      />

      <Header
        brandTop={
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        }
        homeLinkProps={{
          href: "/",
          title: "Accueil - Mon Territoire",
        }}
        serviceTitle="Mon Territoire"
        serviceTagline="Identité, risques et services publics de proximité"
        quickAccessItems={[headerFooterDisplayItem]}
      />

      <Notice
        title="Projet pédagogique, ne constitue pas un service officiel"
        severity="info"
      />

      <main id="main-content" className="fr-container fr-py-4w">
        <h1 className="fr-h1">Consulter votre commune</h1>

        <SearchBar
          query={query}
          onQueryChange={handleQueryChange}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        {status === "initial" && <InitialState />}
        {status === "empty" && <EmptyState query={query} />}
        {status === "error" && <ErrorState message={errorMessage} />}
      </main>

      <Footer
        brandTop={
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        }
        accessibility="non compliant"
        contentDescription="Projet L3 Service Public Numérique - Sujet D."
        bottomItems={[headerFooterDisplayItem]}
      />
    </>
  );
}

export default App;