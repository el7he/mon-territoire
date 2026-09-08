import { Alert } from "@codegouvfr/react-dsfr/Alert";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="fr-my-4w" data-testid="error-state">
      <Alert
        severity="error"
        title="Erreur lors de la recherche"
        description={
          message ||
          "Un problème technique empêche de contacter le service de recherche des communes. Veuillez réessayer ultérieurement."
        }
        className="fr-mb-4w"
      />
      {onRetry && (
        <button className="fr-btn fr-btn--secondary" onClick={onRetry}>
          Réessayer la recherche
        </button>
      )}
    </section>
  );
}

export default ErrorState;
