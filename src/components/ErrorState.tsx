import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function formatUserErrorMessage(rawMessage?: string): string {
  if (!rawMessage) {
    return "Le service de recherche des communes est temporairement indisponible. Veuillez réessayer dans quelques instants.";
  }

  const lower = rawMessage.toLowerCase();

  // Erreur de connexion / réseau interrompu
  if (
    lower.includes("failed to fetch") ||
    lower.includes("networkerror") ||
    lower.includes("network error") ||
    lower.includes("offline") ||
    (typeof navigator !== "undefined" && !navigator.onLine)
  ) {
    return "Impossible de contacter le service (réseau interrompu ou hors connexion). Veuillez vérifier votre connexion Internet puis réessayez.";
  }

  // Interception des erreurs API / codes HTTP bruts / erreurs techniques
  if (
    lower.includes("erreur api") ||
    lower.includes("http") ||
    /\b[1-5]\d\d\b/.test(lower) ||
    lower.includes("fetch") ||
    lower.includes("typeerror") ||
    lower.includes("json")
  ) {
    return "Le service public de recherche des communes rencontre une perturbation temporaire. Veuillez réessayez dans quelques instants.";
  }

  return rawMessage;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const userMessage = formatUserErrorMessage(message);

  return (
    <section className="fr-my-4w" data-testid="error-state" aria-live="assertive">
      <Alert
        severity="error"
        title="Service temporairement indisponible"
        description={
          <div>
            <p className="fr-mb-2w">{userMessage}</p>
            {onRetry && (
              <Button
                priority="secondary"
                iconId="fr-icon-refresh-line"
                onClick={onRetry}
              >
                Réessayer la recherche
              </Button>
            )}
          </div>
        }
        className="fr-mb-4w"
      />
    </section>
  );
}

export default ErrorState;
