export interface CommuneRecord {
  code_insee_commune?: string;
  nom_commune?: string;
  id_service_local?: string;
  code_type_service_local?: string;
  nom_structure?: string;
  adresse?: string;
  code_postal?: string;
  telephone?: string;
  url_site_web?: string;
}

interface AnnuaireResponse {
  total_count?: number;
  results?: CommuneRecord[];
}

const annuaireUrl =
  "https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration-locale-competence-geographique/records";

export async function searchByCommunes(
  query: string,
  signal?: AbortSignal
): Promise<{ records: CommuneRecord[]; totalCount: number }> {
  const cleanQuery = query.trim().replace(/"/g, '\\"');
  const url = new URL(annuaireUrl);

  url.searchParams.set("limit", "20");

  if (cleanQuery) {
    const isCodeInsee = /^\d{2,5}$/.test(cleanQuery);

    let whereClause: string;
    if (isCodeInsee) {
      whereClause = `code_insee_commune LIKE "${cleanQuery}"`;
    } else {
      whereClause = `suggest(nom_commune, "${cleanQuery}") OR code_type_service_local LIKE "${cleanQuery}"`;
    }

    url.searchParams.set("where", whereClause);
  }

  const response = await fetch(url.toString(), {
    headers: { accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Erreur annuaire (${response.status})`);
  }

  const data = (await response.json()) as AnnuaireResponse;

  return {
    records: data.results ?? [],
    totalCount: data.total_count ?? 0,
  };
}