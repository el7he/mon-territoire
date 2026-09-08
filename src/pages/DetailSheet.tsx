import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { fetchCommuneRisks } from "../api/georisques";
import type { RiskSummary } from "../domain/risks.types";
import { NotFoundPage } from "./NotFoundPage";

export function DetailSheet() {
  const { codeInsee } = useParams<{ codeInsee: string }>();
  const [summary, setSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!codeInsee) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    document.title = `Chargement — ${codeInsee}`;
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
        document.title = result.communeName
          ? `${result.communeName} — ${codeInsee}`
          : `Risques — ${codeInsee}`;
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
  }, [codeInsee]);

  if (notFound) return <NotFoundPage />;

  return (
    <>
      <SkipLinks
        links={[{ anchor: "#main-content", label: "Contenu" }]}
      />

      <Header
        brandTop={
          <>
            RÉPUBLIQUE
            <br />
            FRANÇAISE
          </>
        }
        homeLinkProps={{ href: "/", title: "Accueil - Mon Territoire" }}
        serviceTitle="Mon Territoire"
        serviceTagline="Identité, risques et services publics de proximité"
        quickAccessItems={[headerFooterDisplayItem]}
      />

      <main id="main-content" className="fr-container fr-py-4w">
        {loading && <p>Chargement...</p>}

        {error && (
          <Alert severity="error" title="Erreur" description={error} closable={false} />
        )}

        {summary && (
          <>
            <h1 className="fr-h2 fr-mb-1w">
              {summary.communeName ?? "Commune"} - {summary.inseeCode}
            </h1>
            <Badge severity="info" small={false}>
              En cours
            </Badge>

            <section className="fr-mt-4w">
              <h2 className="fr-h4">Risques</h2>
              <ul className="fr-tags-group">
                {summary.risks.map((risk) => (
                  <li key={risk.id}>
                    <Tag>{risk.type}</Tag>
                  </li>
                ))}
              </ul>
            </section>

            <section className="fr-mt-4w">
              <h2 className="fr-h4">Services</h2>
              <Badge severity="info">En cours</Badge>
            </section>
          </>
        )}
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