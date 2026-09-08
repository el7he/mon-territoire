// src/api/georisques.ts

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
    headers: { accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Erreur API Géorisques (${response.status})`);
  }

  const data = await response.json();
  const rawList = Array.isArray(data?.data) ? data.data : [];
  const communeName = rawList[0]?.libelle_commune ?? null;

  return {
    inseeCode: codeInsee,
    communeName,
    risks: rawList.flatMap((commune: any, communeIndex: number) => {
      const details = Array.isArray(commune?.risques_detail) ? commune.risques_detail : [];
      return details.map((item: any, index: number) => ({
        id: item?.num_risque ?? `${codeInsee}-risk-${communeIndex}-${index}`,
        type: item?.libelle_risque_long ?? 'Risque non spécifié',
        description: item?.zone_sismicite ?? 'Pas de détail disponible',
      }));
    }),
  };
}