import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { searchByCommunes, type CommuneRecord } from "../api/annuaire";
import { searchCommunes } from "../api/geoapi";
import type { Commune } from "../domain/commune";

export function DetailSheet() {
  const navigate = useNavigate();
  const { codeInsee } = useParams<{ codeInsee: string }>();
  const [summary, setSummary] = useState<RiskSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState<CommuneRecord[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [communeInfo, setCommuneInfo] = useState<Commune | null>(null);

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

    searchCommunes({ query: codeInsee, signal: controller.signal })
      .then((results) => {
        if (results.length > 0) {
          setCommuneInfo(results[0]);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });

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

    setLoadingServices(true);
    searchByCommunes(codeInsee, controller.signal)
      .then((res) => setServices(res.records))
      .catch((err) => {
        if (err.name !== "AbortError") setServices([]);
      })
      .finally(() => setLoadingServices(false));

    return () => controller.abort();
  }, [codeInsee]);

  if (notFound) return <NotFoundPage />;

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
            {communeInfo ? (
              <div className="fr-mt-2w">
                <p className="fr-text--lead fr-mb-1w">
                  <strong>Région :</strong> {communeInfo.region} — <strong>Département :</strong> {communeInfo.departement}
                </p>
                <p className="fr-card__detail fr-mb-0">
                  <strong>Population :</strong> {communeInfo.population} habitants | <strong>Codes postaux :</strong> {communeInfo.codesPostaux.join(", ")}
                </p>
              </div>
            ) : (
              <p>Chargement des informations de la commune...</p>
            )}

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
              {loadingServices ? (
                <p>Chargement des services publics...</p>
              ) : services.length === 0 ? (
                <p>Aucun service public trouvé pour cette commune.</p>
              ) : (
                <div className="fr-grid-row fr-grid-row--gutters">
                  {services.map((service, index) => (
                    <div
                      key={service.id_service_local || index}
                      className="fr-col-12 fr-col-md-6"
                    >
                      <div className="fr-card fr-card--no-icon">
                        <div className="fr-card__body">
                          <div className="fr-card__content">
                            <h3 className="fr-card__title">
                              {service.nom_structure || service.code_type_service_local || "Service public"}
                            </h3>
                            <p className="fr-card__desc">
                              {service.nom_commune} ({service.code_insee_commune})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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