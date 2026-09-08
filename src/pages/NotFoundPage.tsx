import { useEffect } from "react";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Link, useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Page non trouvée";
  }, []);

  return (
    <>
      <SkipLinks links={[{ anchor: "#main-content", label: "Contenu" }]} />

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
          onClick: (e) => {
            e.preventDefault();
            navigate("/");
          },
        }}
        serviceTitle="Mon Territoire"
        quickAccessItems={[headerFooterDisplayItem]}
      />

      <main id="main-content" className="fr-container fr-py-4w">
        <Alert
          severity="error"
          title="404 — Page non trouvée"
          description="Le code INSEE demandé n'existe pas ou est invalide."
          closable={false}
        />
        <Link to="/risques" className="fr-link fr-mt-2w">
          Retour à la recherche
        </Link>
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
        bottomItems={[headerFooterDisplayItem]}
      />
    </>
  );
}