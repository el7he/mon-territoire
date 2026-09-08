import { Alert } from "@codegouvfr/react-dsfr/Alert";

interface EmptyStateProps {
  query: string;
  onReset?: () => void;
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
  return (
    <section className="fr-my-4w" data-testid="empty-state" aria-live="polite">
      <Alert
        severity="warning"
        title={`Aucune commune trouvée pour "${query}"`}
        description={
          <div>
            <p className="fr-mb-2w">
              Aucun résultat ne correspond à votre recherche <strong>« {query} »</strong>.
            </p>
            <p className="fr-text--bold fr-mb-1w">Actions recommandées :</p>
            <ul className="fr-mb-3w">
              <li>
                <strong>Vérifier l'orthographe</strong> : Assurez-vous qu'il n'y a pas de faute de frappe dans le nom ou que le code postal comporte 5 chiffres.
              </li>
            </ul>
            {onReset && (
              <button
                type="button"
                className="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-refresh-line"
                onClick={onReset}
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        }
        className="fr-mb-4w"
      />
    </section>
  );
}

export default EmptyState;
