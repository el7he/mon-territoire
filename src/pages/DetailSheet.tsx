import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { ErrorState } from "../components/ErrorState";
import { NotFoundPage } from "./NotFoundPage";
import { useCommune } from "../hooks/Commune";
import { useRisks } from "../hooks/Risks";
import { useServices } from "../hooks/Services";
import { Spinner } from "../components/Spinner";
import { normalizeServicePublic } from "../domain/servicePublic";
import type { RiskItem } from "../domain/risks";

export function DetailSheet() {
  const navigate = useNavigate();
  const { codeInsee } = useParams<{ codeInsee: string }>();
  const { communeInfo } = useCommune(codeInsee);
  const { summary, loading, notFound, error, retry } = useRisks(codeInsee);
  const {
    services,
    loadingServices,
    servicesLimit,
    setServicesLimit,
    servicesOffset,
    setServicesOffset,
    totalServices,
  } = useServices(codeInsee);

  useEffect(() => {
    if (summary) {
      document.title = summary.communeName
        ? `${summary.communeName} — ${summary.inseeCode}`
        : `Risques — ${summary.inseeCode}`;
    } else if (notFound) {
      document.title = "Page non trouvée";
    } else if (codeInsee) {
      document.title = `Chargement — ${codeInsee}`;
    }
  }, [summary, notFound, codeInsee]);

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

      <main id="main-content" className="fr-container fr-py-4w" style={{ minHeight: "60vh" }}>
        {(loading || !summary) && !error && (
          <Spinner label="Chargement des informations de la commune..." />
        )}

        {error && (
          <ErrorState message={error} onRetry={retry} />
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
                {summary.risks.map((risk: RiskItem) => (
                  <li key={risk.id}>
                    <Tag>{risk.type}</Tag>
                  </li>
                ))}
              </ul>
            </section>

            <section className="fr-mt-4w">
              <div
                className="fr-mb-2w"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <h2 className="fr-h4 fr-mb-0" style={{ margin: 0 }}>
                  Services publics
                </h2>

                <span className="fr-text--sm fr-mb-0">
                  Nombre de resultats :{" "}
                  {totalServices}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

                  <label
                    htmlFor="services-limit-select"
                    className="fr-text--sm fr-mb-0"
                    style={{ margin: 0, whiteSpace: "nowrap" }}
                  >
                    Afficher par page :
                  </label>
                  <select
                    id="services-limit-select"
                    className="fr-select"
                    style={{
                      width: "auto",
                      display: "inline-block",
                      minHeight: "auto",
                      padding: "0.25rem 2rem 0.25rem 0.75rem",
                      margin: 0,
                    }}
                    value={servicesLimit}
                    onChange={(e) => {
                      setServicesLimit(Number(e.target.value));
                      setServicesOffset(0);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {loadingServices ? (
                <Spinner label="Chargement des services publics..." />
              ) : services.length === 0 ? (
                <p>Aucun service public trouvé pour cette commune.</p>
              ) : (
                <>
                  <div className="fr-grid-row fr-grid-row--gutters">
                    {services.map((service, index) => {
                      const normalized = normalizeServicePublic(service);
                      return (
                        <div
                          key={normalized.id || index}
                          className="fr-col-12 fr-col-md-6"
                        >
                          <div className="fr-card fr-card--no-icon">
                            <div className="fr-card__body">
                              <div className="fr-card__content">
                                <h3 className="fr-card__title">
                                  {normalized.nomStructure}
                                </h3>
                                <p className="fr-card__desc fr-mb-0">
                                  {normalized.adresse}
                                </p>
                                {normalized.nomCommune && (
                                  <p className="fr-card__detail fr-mt-1v">
                                    {normalized.nomCommune} ({normalized.codeInsee})
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Barre de navigation de pagination */}
                  <div
                    className="fr-mt-4w fr-py-2w"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderTop: "1px solid var(--border-subtle-grey, #eeeeee)",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <span className="fr-text--sm fr-mb-0">
                      Affichage des services {servicesOffset + 1} à{" "}
                      {Math.min(servicesOffset + services.length, totalServices)} sur{" "}
                      {totalServices}
                    </span>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Button
                        priority="secondary"
                        iconId="fr-icon-arrow-left-line"
                        iconPosition="left"
                        disabled={servicesOffset === 0 || loadingServices}
                        onClick={() => {
                          setServicesOffset((prev) => Math.max(0, prev - servicesLimit));
                        }}
                      >
                        Précédent
                      </Button>
                      <Button
                        priority="secondary"
                        iconId="fr-icon-arrow-right-line"
                        iconPosition="right"
                        disabled={
                          servicesOffset + services.length >= totalServices ||
                          loadingServices
                        }
                        onClick={() => {
                          setServicesOffset((prev) => prev + servicesLimit);
                        }}
                      >
                        Suivant ({servicesLimit} suivants)
                      </Button>
                    </div>
                  </div>
                </>
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