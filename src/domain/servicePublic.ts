export interface ApiServiceRaw {
  code_insee_commune?: string | null;
  nom_commune?: string | null;
  id_service_local?: string | null;
  code_type_service_local?: string | null;
  nom_structure?: string | null;
  adresse?: string | null;
  code_postal?: string | null;
  telephone?: string | null;
  url_site_web?: string | null;
}

export interface ServicePublic {
  id: string;
  codeInsee: string;
  nomCommune: string;
  codeTypeService: string;
  nomStructure: string;
  adresse: string;
  codePostal: string;
  telephone: string;
  urlSiteWeb: string;
}

export function normalizeServicePublic(raw?: ApiServiceRaw | null): ServicePublic {
  const safe = raw || {};

  const adresseClean =
    typeof safe.adresse === "string" && safe.adresse.trim().length > 0
      ? safe.adresse.trim()
      : "Adresse non renseignée";

  return {
    id: safe.id_service_local || safe.code_type_service_local || "service-inconnu",
    codeInsee: safe.code_insee_commune || "N/A",
    nomCommune: safe.nom_commune || "Commune non renseignée",
    codeTypeService: safe.code_type_service_local || "service",
    nomStructure: safe.nom_structure || safe.code_type_service_local || "Service public",
    adresse: adresseClean,
    codePostal: safe.code_postal || "Non renseigné",
    telephone: safe.telephone || "Non renseigné",
    urlSiteWeb: safe.url_site_web || "",
  };
}
