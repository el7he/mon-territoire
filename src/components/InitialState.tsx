import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Tile } from "@codegouvfr/react-dsfr/Tile";

export function InitialState() {
  return (
    <section className="fr-my-4w" aria-labelledby="welcome-title">
      <CallOut
        iconId="fr-icon-information-line"
        title="Bienvenue sur Mon Territoire"
        className="fr-mb-4w"
      >
        <p className="fr-text--lead">
          Recherchez une commune française par son <strong>nom</strong> ou son <strong>code postal</strong> pour obtenir sa fiche d'identité synthétique complète.
        </p>
      </CallOut>

      <div className="fr-callout fr-callout--accent fr-mb-4w">
        <h2 className="fr-callout__title fr-h4 fr-icon-search-line">
          Comment utiliser ce service ?
        </h2>
        <ol className="fr-callout__text fr-mb-0 fr-pl-3w">
          <li className="fr-mb-1w">
            Saisissez le nom d'une commune ou un code postal dans le champ de recherche.
          </li>
          <li className="fr-mb-1w">
            Sélectionnez la commune souhaitée dans la liste des résultats.
          </li>
          <li>
            Consultez les 3 blocs d'information de votre territoire.
          </li>
        </ol>
      </div>

      <h2 className="fr-h3 fr-mb-3w" id="welcome-title">
        Les 3 volets d'information
      </h2>

      <div className="fr-grid-row fr-grid-row--gutters">
        <div className="fr-col-12 fr-col-md-4">
          <Tile
            title="1. Identité Administrative"
            desc="Code INSEE, région, département, population et localisation."
            orientation="vertical"
          />
        </div>

        <div className="fr-col-12 fr-col-md-4">
          <Tile
            title="2. Risques Majeurs"
            desc="Catastrophes naturelles, préventions et risques technologiques (Géorisques)."
            orientation="vertical"
          />
        </div>

        <div className="fr-col-12 fr-col-md-4">
          <Tile
            title="3. Services Publics"
            desc="Coordonnées et démarches des services publics de proximité."
            orientation="vertical"
          />
        </div>
      </div>
    </section>
  );
}

export default InitialState;
