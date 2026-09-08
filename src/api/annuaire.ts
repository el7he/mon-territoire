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

interface SearchOptions {
  limit?: number;
  offset?: number;
  signal?: AbortSignal;
}

const geoCompetenceUrl =
  "https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration-locale-competence-geographique/records";

const adminUrl =
  "https://api-lannuaire.service-public.fr/api/explore/v2.1/catalog/datasets/api-lannuaire-administration/records";

function formatAdresse(adresseJson?: string | null): string | undefined {
  if (!adresseJson) return undefined;
  try {
    const parsed = JSON.parse(adresseJson);
    const primary = Array.isArray(parsed)
      ? parsed.find((a: any) => a.type_adresse === "Adresse") || parsed[0]
      : parsed;
    if (!primary) return undefined;
    const parts = [
      primary.numero_voie,
      primary.complement1,
      primary.code_postal,
      primary.nom_commune,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" ") : undefined;
  } catch (e) {
    return adresseJson;
  }
}

export async function searchByCommunes(
  query: string,
  optionsOrSignal?: SearchOptions | AbortSignal
): Promise<{ records: CommuneRecord[]; totalCount: number }> {
  let signal: AbortSignal | undefined;
  let limit = 20;
  let offset = 0;

  if (optionsOrSignal instanceof AbortSignal) {
    signal = optionsOrSignal;
  } else if (optionsOrSignal) {
    signal = optionsOrSignal.signal;
    if (optionsOrSignal.limit !== undefined) limit = optionsOrSignal.limit;
    if (optionsOrSignal.offset !== undefined) offset = optionsOrSignal.offset;
  }

  const cleanQuery = query.trim().replace(/"/g, '\\"');
  const url = new URL(geoCompetenceUrl);

  url.searchParams.set("limit", limit.toString());
  url.searchParams.set("offset", offset.toString());

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
  const rawRecords = data.results ?? [];

  const idMap = new Map<CommuneRecord, string>();
  const idList: string[] = [];

  for (const record of rawRecords) {
    if (record.id_service_local) {
      try {
        const parsed = JSON.parse(record.id_service_local);
        const firstId = Array.isArray(parsed) ? parsed[0] : parsed;
        if (firstId) {
          idList.push(`"${firstId}"`);
          idMap.set(record, firstId);
        }
      } catch (e) {
      }
    }
  }

  if (idList.length > 0) {
    try {
      const detailsUrl = new URL(adminUrl);
      detailsUrl.searchParams.set("where", `id IN (${idList.join(",")})`);
      detailsUrl.searchParams.set("limit", idList.length.toString());

      const detailsResponse = await fetch(detailsUrl.toString(), {
        headers: { accept: "application/json" },
        signal,
      });

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        const adminMap = new Map<string, any>(
          (detailsData.results || []).map((r: any) => [r.id, r])
        );

        for (const record of rawRecords) {
          const serviceId = idMap.get(record);
          if (serviceId) {
            const detail = adminMap.get(serviceId);
            if (detail) {
              if (detail.nom) record.nom_structure = detail.nom;
              if (detail.adresse) record.adresse = formatAdresse(detail.adresse);
            }
          }
        }
      }
    } catch (e) {
    }
  }

  return {
    records: rawRecords,
    totalCount: data.total_count ?? 0,
  };
}