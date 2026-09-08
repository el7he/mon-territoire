import { Alert } from "@codegouvfr/react-dsfr/Alert";

interface EmptyStateProps {
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <section className="fr-my-4w" data-testid="empty-state">
      <Alert
        severity="warning"
        title="Aucune commune trouvée"
        description={`Aucun résultat ne correspond à la recherche "${query}". Vérifiez l'orthographe du nom ou le code postal saisi.`}
        className="fr-mb-4w"
      />
    </section>
  );
}

export default EmptyState;
