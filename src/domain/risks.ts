export interface RiskItem {
  id: string;
  type: string;
  description: string;
}

export interface RiskSummary {
  inseeCode: string;
  communeName: string;
  risks: RiskItem[];
}

export function normalizeRiskItem(raw?: any): RiskItem {
  const safe = raw || {};
  return {
    id: String(safe.id || safe.num_risque || "risk-inconnu"),
    type: safe.type || safe.libelle_risque_long || "Risque non spécifié",
    description: safe.description || safe.zone_sismicite || "Pas de détail disponible",
  };
}

export function normalizeRiskSummary(raw?: any, fallbackInseeCode = "Inconnu"): RiskSummary {
  const safe = raw || {};
  const rawRisks = Array.isArray(safe.risks) ? safe.risks : [];

  return {
    inseeCode: safe.inseeCode || safe.code_insee || fallbackInseeCode,
    communeName: safe.communeName || safe.libelle_commune || "Nom non renseigné",
    risks: rawRisks.map((r: any) => normalizeRiskItem(r)),
  };
}
