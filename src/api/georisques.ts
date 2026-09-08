import type { RiskSummary } from '../domain/risks.types';

interface FetchRisksParams {
  codeInsee: string;
  rayon?: number;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}

export async function fetchCommuneRisks({
  codeInsee,
  rayon = 1000,
  page = 1,
  pageSize = 10,
  signal,
}: FetchRisksParams): Promise<RiskSummary> {
  const url = new URL('https://www.georisques.gouv.fr/api/v1/gaspar/risques');
  url.searchParams.set('code_insee', codeInsee);
  url.searchParams.set('rayon', rayon.toString());
  url.searchParams.set('page', page.toString());
  url.searchParams.set('page_size', pageSize.toString());

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Erreur API Géorisques (${response.status})`);
  }

  const data = await response.json();

  // Extraction sécurisée pour éviter les crashs si l'API renvoie des listes vides/nulles (US C2)
  const rawList = Array.isArray(data?.data) ? data.data : [];

  return {
    inseeCode: codeInsee,
    risks: rawList.map((item: any, index: number) => ({
      id: item?.num_risque ?? `${codeInsee}-risk-${index}`,
      type: item?.libelle_risque_jo ?? 'Risque non spécifié',
      description: item?.libelle_alea ?? 'Pas de détail disponible',
    })),
  };
}