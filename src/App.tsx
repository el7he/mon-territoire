import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import AnnuaireSearch from './AnnuaireSearch'

export function App() {
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
        <h1 className="fr-h1">Bienvenue sur Mon Territoire</h1>
        <p className="fr-text--lead">
          Fiche d'identité d'une commune : informations administratives, risques et services publics.
        </p>
        <AnnuaireSearch />
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